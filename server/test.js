
import { BlobServiceClient, generateBlobSASQueryParameters, BlobSASPermissions, StorageSharedKeyCredential } from '@azure/storage-blob';
import { DefaultAzureCredential } from '@azure/identity';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve('./.env') });

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

async function testSasGeneration() {
    try {
        const blobName = '5b2980f6-08f4-4558-90e4-a56a1c0092cf.pdf';
        const expiryTime = new Date(Date.now() + 3600000);

        const sasUrl = await generateSasUrl(blobName, expiryTime);
        console.log('Generated SAS URL:', sasUrl);
        //add testing code here.
    } catch (error) {
        console.error('Error generating SAS URL:', error);
    }
}

testSasGeneration();