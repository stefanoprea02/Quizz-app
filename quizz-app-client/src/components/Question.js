import React from "react";
import {nanoid} from "nanoid"

export default function Question(props){

    function decodeHTML(html){
        var txt = document.createElement("textarea");
        txt.innerHTML = html;
        return txt.value;
    }

    const questionElements = props.randomAnswers.map((ans, index) => {
        return  <div
                    className="option"
                    onClick={props.changeSelected}
                    id={props.id}
                    key={nanoid()}
                    style={
                        {
                        backgroundColor : 
                            props.checked == false ? 
                                props.selected == index ? 
                                    "#D6DBF5" : 
                                    "#F5F7FB" : 
                                props.selected == index ? 
                                    props.randomAnswers[index] == props.correct_answer ?
                                        "#94D7A2" : 
                                        "#F8BCBC" : 
                                props.randomAnswers[index] == props.correct_answer ?
                                        "#94D7A2" :
                                        "#F5F7FB",
                        opacity: props.checked == true ? props.selected == index ? props.randomAnswers[index] == props.correct_answer ? 1 : 0.5 : 1 : 1
                        }
                    }
                >
                    {decodeHTML(ans)}
                </div>
    })

    return (
        <div className="question">
            <h1 className="question-text">{`${props.question}`}</h1>
            <div className="options">
                {questionElements}
            </div>
            <hr></hr>
        </div>
    );
}