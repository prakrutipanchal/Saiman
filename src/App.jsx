import { useState } from 'react'
import React from 'react'
import SignUp from './components/signUp'
import './App.css'
import { Outlet } from 'react-router-dom'
import UploadQuestionPaper from './components/TeacherDashboard/Upload_paper'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Outlet/>
    </>
  )
}

export default App
