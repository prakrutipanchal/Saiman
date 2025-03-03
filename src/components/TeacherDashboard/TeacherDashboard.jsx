import React from "react";
import { Outlet } from "react-router-dom";

function Teacher()
{
    return(
        <>
            <h3>Teacher Dashboard!!</h3>
            <Outlet />
        </>
    )
}

export default Teacher;