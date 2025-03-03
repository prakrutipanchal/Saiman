import io from 'socket.io-client';
import React, { useEffect, useState } from 'react';

const socket = io('http://localhost:5000');

function StudentDashboard() {
    const [activeExams, setActiveExams] = useState([]);

    useEffect(() => {
        socket.on('active-exam', (examData) => {
            setActiveExams((prevExams) => {
                const isDuplicate = prevExams.some(
                    (existingExam) => existingExam.pdfUrl === examData.pdfUrl
                );
                if (isDuplicate) {
                    return prevExams;
                }
                return [...prevExams, examData];
            });
        });
        

        return () => {
            socket.off('active-exam');
        };
    }, []);

    return (
        <div>
            {activeExams.map((exam, index) => (
                <div key={index}>
                    <h2>{exam.title}</h2>
                    <a href={exam.pdfUrl} target="_blank" rel="noopener noreferrer">
                        View Question Paper
                    </a>
                    <p>Start Time: {new Date(exam.startTime).toLocaleString()}</p>
                    <p>End Time: {new Date(exam.endTime).toLocaleString()}</p>
                    <p>Duration: {exam.duration} minutes</p>
                </div>
            ))}
        </div>
    );
}

export default StudentDashboard;

