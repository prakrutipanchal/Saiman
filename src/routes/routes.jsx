import React from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Home from "../components/home.jsx";
import Admin from '../components/AdminDashboard/admin.jsx';
import Student from '../components/StudentDashboard/StudentDashboard.jsx';
import ExamWindow from '../components/StudentDashboard/ViewExamPaper.jsx'
import Teacher from '../components/TeacherDashboard/TeacherDashboard.jsx';
import UploadExamForm from '../components/TeacherDashboard/Upload_paper.jsx';
import View_answer from '../components/TeacherDashboard/View_answer.jsx'
import SignIn from '../components/signIn.jsx';
import SignUp from '../components/signUp.jsx';
import App from '../App.jsx';

const RoleRoute = ({ element, roleRequired }) => {
  const { status, role } = useSelector(state => state.auth);

  if (!status) return <Navigate to="/signin" />;
  if (role !== roleRequired) return <Navigate to={`/${role}`} />;
  
  return element;
};

const ProtectedRoute = ({ element }) => {
  const status = useSelector(state => state.auth.status);
  return status ? element : <Navigate to="/signin" />;
};

export const routes = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { path: 'signup', element: <SignUp /> },
      { path: 'signin', element: <SignIn /> },
      { path: 'home', element: <ProtectedRoute element={<Home />} /> },
      { path: 'admin', element: <RoleRoute element={<Admin />} roleRequired="admin" /> },
      {
        path: 'teacher',
        element: <RoleRoute element={<Teacher/>} roleRequired="teacher"/>,
        children: [
          { path: 'upload-paper', element: < UploadExamForm/> },
          { path: 'view-answers', element: < View_answer/> },
        ],
      },
      { 
        path: 'student', 
        element: <RoleRoute element={<Student />} roleRequired="student" />,
        children: [
          {path: 'ExamWindow', element: <ExamWindow/>}
        ]
      },
    ],
  },
]);
