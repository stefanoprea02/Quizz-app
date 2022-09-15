import React from "react";
import Question from "../components/Question";
import blob1 from "../images/blob1.png";
import blob2 from "../images/blob2.png";
import {nanoid} from "nanoid";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';

export default function Main(){

    const [token, setToken] = React.useState("");
    const [data, setData] = React.useState([]);
    const [status, setStatus] = React.useState([0,0]);
    const url = `https://opentdb.com/api.php?amount=5&token=${token}`

    async function fetchToken(){
        const response = await fetch("https://opentdb.com/api_token.php?command=request");
        const json = await response.json();
        setToken(json.token);
    }

    async function fetchData(){
        const response = await fetch(url);
        const json = await response.json();
        if(json.response_code != 0){
            fetchToken();
        }else{
            setData(json.results.map(prev => {

                let n = prev.type == "boolean" ? 2 : 4;
                let random = Math.floor(Math.random() * n);
                let allAnswers = [prev.correct_answer, ...prev.incorrect_answers];
                let randomArray = [];
            
                while(n){
                    let randomValue = allAnswers[random];
                    n--;
                    allAnswers = allAnswers.filter(x => x!=randomValue);
                    random = Math.floor(Math.random() * n);
                    randomArray.push(randomValue);
                }

                return {
                    ...prev,
                    id: nanoid(),
                    selected: -1,
                    randomAnswers: randomArray,
                    checked: false
                }
            }));
        }
    }

    function decodeHTML(html){
        var txt = document.createElement("textarea");
        txt.innerHTML = html;
        return txt.value;
    }

    function changeSelected(event){
        setData(data.map(prev => {
            const found = prev.randomAnswers.findIndex(x => decodeHTML(x) == decodeHTML(event.target.innerHTML));
            return prev.id == event.target.id ? {
                ...prev,
                selected: found
            } : prev
        }));
    }

    React.useEffect(function(){
        fetchToken();
      }, []);

    React.useEffect(function(){
        fetchData();
    },[]);

    let questionElements = [];
    if(Object.keys(data).length != 0){
        questionElements = data.map(obiect => {
            return <Question 
                question={decodeHTML(obiect.question)} 
                randomAnswers={obiect.randomAnswers}
                type={obiect.type}
                key={obiect.id}
                id={obiect.id}
                changeSelected={event => changeSelected(event)}
                selected={obiect.selected}
                correct_answer={obiect.correct_answer}
                checked={obiect.checked}
            />
        });
    }

    async function callAPI(a, b){
        let user;

        await fetch('http://localhost:8080/users/logged-user', {credentials: 'include'})
            .then((response) => response.json())
            .then((data) => user = data.username);

        await fetch('http://localhost:8080/users/update', {
            method: 'POST',
            headers: {
                'Accept': 'application/json', 
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({corAns: a, incAns: b, username: user})
        }, {credentials: 'include'})
    }

    function checkAnswers(){
        let a = 0;
        setData(data.map(prev => {
            if(prev.randomAnswers[prev.selected] == prev.correct_answer){
                a++;
            }
            return {
                ...prev,
                checked: true
            }
        }));
        callAPI(a, 5-a);
        setStatus([a, 1]);
    }

    function playAgain(){
        setData(fetchData());
        setStatus([0,0]);
    }
    
    return (
        <>
            <main className="main">
            <Link to='/'><FontAwesomeIcon icon={faHome} className="home" /></Link>
                {questionElements}
                {status[1] == 0 ? 
                    <button className="title-button" onClick={checkAnswers}>Check answers</button> 
                    : 
                    <div className="main-playAgain">
                        <h3 className="main-playAgain-text">You scored {status[0]}/5 correct answers.</h3>
                        <button className="main-playAgain-button" onClick={playAgain}>Play again</button>
                    </div>
                }
            </main>
            <img src={blob1} className="blob1"></img>
            <img src={blob2} className="blob2"></img>
        </>
    );

}