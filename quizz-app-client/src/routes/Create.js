import React from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import blob1 from "../images/blob1.png"
import blob2 from "../images/blob2.png"

export default function Create(){

    const [error, setError] = React.useState("");
    const [formData, setFormData] = React.useState({
        username: "",
        email: "",
        password: ""
    });

    function handleChange(event){
        setFormData(prevFormData => {
            return {
                ...prevFormData,
                [event.target.name]: event.target.value
            }
        })
    }

    async function handleCreate(){

        if(formData.username === "" || formData.email === "" || formData.password === ""){
            setError("$allfields");
            return;
        }

        if(formData.username[0] === "$"){
            setError("$user$");
            return;
        }

        await fetch('http://localhost:8080/users/find-user', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        }, {credentials: 'include'})
        .then((response) => response.json())
        .then((_data) => setError(_data.user))
    }

    React.useEffect(function(){
        if(error !== ""){
            if(error === "$nouser"){
                fetch("http://localhost:8080/users/create", {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(formData)
                }, {credentials: 'include'})

                window.location.replace('http://localhost:3000');
            }
        }
    }, [error]);

    return(
        <>
            <form className="login-form">
                <Link to='/'><FontAwesomeIcon icon={faHome} className="home" /></Link>
                <input 
                    type="text" 
                    id="username" 
                    name="username" 
                    placeholder="username" 
                    onChange={handleChange}
                    value={formData.username}
                ></input>
                <input 
                    type="text" 
                    id="email" 
                    name="email" 
                    placeholder="email" 
                    onChange={handleChange}
                    value={formData.email}
                ></input>
                <input 
                    type="password" 
                    id="password" 
                    name="password" 
                    placeholder="password" 
                    onChange={handleChange}
                    value={formData.password}
                ></input>
                <input 
                    className="login-form-submit" 
                    type="button" 
                    onClick={handleCreate} 
                    value="Sign up"
                ></input>
                {
                    error && 
                    error!=="$nouser" && 
                    error!=="$allfields" && 
                    error!=="$user$" && 
                    <p className="error-message">Username already in use</p>
                }
                {
                    error==="$allfields" && 
                    <p className="error-message">All fields must be completed</p>
                }
                {
                    error==="$user$" && 
                    <p className="error-message">Username can&apos;t start with $</p>
                }
            </form>
            <img src={blob1} className="blob1"></img>
            <img src={blob2} className="blob2"></img>
        </>
    );
}