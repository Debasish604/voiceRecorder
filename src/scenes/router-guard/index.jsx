import React from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";


function Protected(pros) {
    const { Component } = pros;
    const navigate = useNavigate();
    useEffect(() => {
        let login = localStorage.getItem('jwttoken');
        // console.log("token", login);
        if (!login) {
            navigate('/')
        }
    })
    return (
        <div>
            <Component />
        </div>
    )
}
export default Protected;