
import { BlobServiceClient, StorageSharedKeyCredential, BlobSASPermissions, generateBlobSASQueryParameters } from '@azure/storage-blob';
import supabase from './supabaseClient.js';
import express from 'express';
import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import { createServer } from 'http';
import { Server } from 'socket.io';

dotenv.config({ path: path.resolve('./.env') });

const app = express();
const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"],
    },
});
const upload = multer({ storage: multer.memoryStorage() });

app.use(cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
}));

const blobServiceClient = BlobServiceClient.fromConnectionString(process.env.AZUREBLOB_CONNECTION_STRING);
const containerClient = blobServiceClient.getContainerClient(process.env.BLOB_CONTAINER_NAME);

(async () => {
    try {
        const exists = await containerClient.exists();
        console.log("Checking container:", exists);
    } catch (error) {
        console.error("Error checking container:", error);
    }
})();

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

setInterval(sendActiveExams, 15000); 

io.on('connection', async (socket) => {
    console.log('A user connected');
    await sendActiveExams();

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

async function generateSasUrl(blobName, expiryTime) {
    let credential;
    if (process.env.AZURE_STORAGE_KEY) {
        credential = new StorageSharedKeyCredential(process.env.AZURE_STORAGE_ACCOUNTNAME, process.env.AZURE_STORAGE_KEY);
    } else {
        credential = new DefaultAzureCredential();
    }

    const blobServiceClient = new BlobServiceClient(
        `https://${process.env.AZURE_STORAGE_ACCOUNTNAME}.blob.core.windows.net`,
        credential
    );
    const containerClient = blobServiceClient.getContainerClient(process.env.BLOB_CONTAINER_NAME);
    const blobClient = containerClient.getBlobClient(blobName);

    const sasOptions = {
        containerName: process.env.BLOB_CONTAINER_NAME,
        blobName: blobName,
        permissions: BlobSASPermissions.parse('r'),
        expiresOn: expiryTime,
    };

    const sasToken = generateBlobSASQueryParameters(sasOptions, credential).toString();
    const sasUrl = `${blobClient.url}?${sasToken}`;
    return sasUrl;
}

async function sendActiveExams() {
    const now = new Date().toISOString();
    const { data: exams, error } = await supabase
        .from('question_papers')
        .select('*')
        .lte('exam_start_time', now)
        .gte('exam_end_time', now);

    if (error) {
        console.error("Error fetching exams:", error);
        return;
    }

    if (exams && exams.length > 0) {
        for (const exam of exams) {
            io.emit('active-exam', {
                pdfUrl: exam.sas_token,
                title: exam.title,
                startTime: exam.exam_start_time,
                endTime: exam.exam_end_time,
                duration: exam.exam_duration,
            });
        }
    }
}

app.post('/upload', upload.single('questionPaper'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        const { title, duration, teacher_id } = req.body;
        console.log("Received Data:", { title, duration, teacher_id });

        if (!teacher_id) {
            return res.status(400).json({ error: 'Teacher ID is required' });
        }

        const durationInMinutes = parseInt(duration, 10);

        if (isNaN(durationInMinutes) || durationInMinutes <= 0) {
            return res.status(400).json({ error: 'Invalid duration' });
        }

        const blobName = `${uuidv4()}.pdf`;
        const blockBlobClient = containerClient.getBlockBlobClient(blobName);
        console.log("Uploading to Azure Blob:", blobName);

        await blockBlobClient.uploadData(req.file.buffer, { blobHTTPHeaders: { blobContentType: 'application/pdf' } });

        const pdfUrl = blockBlobClient.url;
        console.log("File uploaded successfully, URL:", pdfUrl);

        const startTime = new Date().toISOString();
        const endTime = new Date(Date.now() + durationInMinutes * 60 * 1000); 

        const sasUrl = await generateSasUrl(blobName, endTime); 
        console.log("SAS URL before insert:", sasUrl);

        const { data, error } = await supabase
            .from('question_papers')
            .insert([{
                teacher_id,
                title,
                pdf_url: pdfUrl,
                exam_start_time: startTime,
                exam_end_time: endTime.toISOString(),
                exam_duration: durationInMinutes,
                sas_token: sasUrl, 
            }])
            .select();

        if (error) {
            console.error("Supabase Error:", error);
            return res.status(500).json({ error: `Supabase error: ${error.message}` });
        }

        await sendActiveExams(); 
        res.status(200).json({ message: 'Exam created successfully', data });
    } catch (error) {
        console.error("Server Error:", error);
        res.status(500).json({ error: error.message });
    }
});
