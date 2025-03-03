import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import supabase from '../../supabaseClient';

const ExamForm = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [teacherId, setTeacherId] = useState(null);
    const [isLoading, setIsLoading] = useState(true); 

    useEffect(() => {
        const getUserId = async () => {
            setIsLoading(true); 
            try {
                const { data: { user }, error } = await supabase.auth.getUser();

                if (error) {
                    console.error("Error fetching user:", error.message);
                    return;
                }

                if (user) {
                    setTeacherId(user.id);
                } else {
                    console.warn("No user session found.");
                }
            } catch (error) {
                console.error("Error fetching user data:", error.message);
            } finally {
                setIsLoading(false); 
            }
        };
        getUserId();
    }, []);

    const onSubmit = async (data) => {
        if (!teacherId) {
            console.error("Teacher ID is not available. Please ensure the user is authenticated.");
            alert("Teacher ID is not available. Please ensure the user is authenticated.");
            return;
        }

        const formData = new FormData();
        formData.append('title', data.examTitle);
        formData.append('duration', data.examDuration);
        formData.append('teacher_id', teacherId); 

        if (data.questionPaper && data.questionPaper[0]) {
            formData.append('questionPaper', data.questionPaper[0]);
        }

        try {
            const response = await fetch('http://localhost:5000/upload', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to create exam');
            }

            const result = await response.json();
            console.log("Exam created successfully:", result);
            alert("Exam created successfully!"); 
        } catch (error) {
            console.error("Error uploading exam:", error.message);
            alert(`Error creating exam: ${error.message}`);
        }
    };


    if (isLoading) {
        return <div>Loading...</div>; 
    }

    return (
        <div>
            <h2>Create Exam</h2>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div>
                    <label>
                        Exam Title:
                        <input className="mb-2" type="text" {...register('examTitle', { required: true })} /><br />
                        {errors.examTitle && <span>This field is required</span>}
                    </label>
                </div>

                <div>
                    <label>
                        Exam Duration (in minutes):
                        <input className="mb-2" type="number" {...register('examDuration', { required: true })} /><br />
                        {errors.examDuration && <span>This field is required</span>}
                    </label>
                </div>

                <div>
                    <label>
                        Upload Question Paper:
                        <input
                            className="mb-2"
                            type="file"
                            accept=".pdf,.doc,.docx"
                            {...register('questionPaper', { required: true })}
                        />
                        {errors.questionPaper && <span>A question paper is required</span>}
                    </label>
                </div>

                <button type="submit">Create Exam</button>
            </form>
        </div>
    );
};

export default ExamForm;
