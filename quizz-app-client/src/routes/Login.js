import React from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import blob1 from "../images/blob1.png"
import blob2 from "../images/blob2.png"
export default function Login(){

    return (
        <> 
            <form className="login-form" action="http://localhost:8080/users/login" method="POST">
                <Link to='/'><FontAwesomeIcon icon={faHome} className="home" /></Link>
                <input type="text" id="username" name="username" placeholder="username"></input>
                <input type="password" id="password" name="password" placeholder="password"></input>
                <input className="login-form-submit" type="submit" value="Log in"></input>
            </form>
            <img src={blob1} className="blob1"></img>
            <img src={blob2} className="blob2"></img>
        </>
    );
}