import React from "react";
import blob1 from "../images/blob1.png"
import blob2 from "../images/blob2.png"
import { BrowserRouter, Route, Switch, Link } from 'react-router-dom';

export default function Title(props){

    const [loggedIn, setLoggedIn] = React.useState("nu");

    function call(){
        fetch('http://localhost:3000/users/loggedin', {credentials: 'include'})
        .then((response) => response.json())
        .then((data) => {
            setLoggedIn(data.ok);
        });
    }

    React.useEffect(function(){
        call();
      }, []);

    function Logout(){
        fetch('http://localhost:3000/users/logout', {credentials: 'include'})
        setLoggedIn("nu");
    }

    return (
        <>
            <div className="firstPage">
                <div className="title">
                    <h1 className="title-text">Quizzical</h1>
                    {loggedIn == "da" && <Link to='/Main'><button className="title-button">Start quiz</button></Link>}
                    {loggedIn == "da" && <Link to='/User'><button className="title-button">User</button></Link>}
                    {loggedIn == "da" && <button className="title-button" onClick={Logout}>Log out</button>}
                    {loggedIn == "nu" && <Link to='/Login'><button className="title-button">Log in</button></Link>}
                    {loggedIn == "nu" && <Link to='/Create'><button className="title-button">Sign up</button></Link>}
                </div>
            </div>
            <img src={blob1} className="blob1"></img>
            <img src={blob2} className="blob2"></img>
        </>
    );
}