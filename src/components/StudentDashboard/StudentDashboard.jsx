import React from "react";
import { Outlet } from "react-router-dom";

export default function Student()
{
    return(
        <>
        <h3>Student Dashboard!!</h3>
        <Outlet/>
        </>
        
    )
}