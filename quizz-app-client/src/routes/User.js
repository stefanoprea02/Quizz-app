import React from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import blob1 from "../images/blob1.png"
import blob2 from "../images/blob2.png"

export default function User(){

    const [user, setUser] = React.useState({
        username: "",
        answers: []
    });

    function getLogged(){
        fetch('http://localhost:8080/users/logged-user', {credentials: 'include'})
        .then((response) => response.json())
        .then((data) => {
            let string = data.answers;
            string = string.replace("[", "");
            string = string.replace("]", "");
            let a = string.split(",");
            a[0] = parseInt(a[0]);
            a[1] = parseInt(a[1]);
            data.answers = a;
            setUser({
                username: data.username,
                answers: data.answers
            });
        });
    }

    let wr = Math.round((user.answers[0] / (user.answers[0] + user.answers[1])) * 10000) / 100;
    let lr = Math.round((user.answers[1] / (user.answers[0] + user.answers[1])) * 10000) / 100;

    React.useEffect(function(){
        getLogged();
    },[]);

    function destroy(){
        fetch('http://localhost:8080/users/destroy', {credentials: 'include'})

        window.location.replace('http://localhost:3000');
    }

    return (
        <>
            <div className="user">
                <Link to='/'><FontAwesomeIcon icon={faHome} className="home" /></Link>
                <h1 className="user-title">Username: {user.username}</h1>
                <div className="user-stats">
                    <p>Number of answers: {user.answers[0] + user.answers[1]}</p>
                    <p>Number of correct answers: {user.answers[0]}  ({wr}%)</p>
                    <p>Number of wrong answers: {user.answers[1]}  ({lr}%)</p>
                </div>
                <button className="title-button" onClick={destroy}>Delete user</button>
            </div>
            <img src={blob1} className="blob1"></img>
            <img src={blob2} className="blob2"></img>
        </>
    );
}