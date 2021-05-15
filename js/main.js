//all the logic
document.getElementById("question").innerHTML = "Click 'next question' for your questions to start appearing";
let functionRun = 0;
let questionNum = Math.floor(Math.random() * data[0].questionAndPoints.length);
let rand = Math.floor(Math.random() * data.length);
let randQuestionAndPoints = data[rand].questionAndPoints;
let question = randQuestionAndPoints[questionNum].question;
let answer = randQuestionAndPoints[questionNum].answer;
let inputElement = document.getElementById("showAndHide");
inputElement.style.display =  "none";
let points = 0;
function wrongMessage (answer) {
    let message = ` <div class="alert alert-danger" role="alert"> <b>You got the last question incorrect.<br/> The answer is: __ANSWER__ &#129300;</b></div>`;
    return message.replace("__ANSWER__", answer);
}
function rightMessage (points) {
    let message = `<div class="alert alert-success" role="alert"><b> You got the last question correct!</b><br/><b> You have __POINTS__ point(s)! &#128077;</b></div>`;
    return message.replace("__POINTS__", points);
}

function nextQuestion () {
    inputElement.style.display = "block";
    document.getElementById("next").innerHTML = "Continue";
    if(functionRun > 0){
        if(document.getElementById("input").value.toLowerCase() == ""){
            document.getElementById("result").innerHTML = `<div class="alert alert-warning" role="alert">You did not answer the last question!<br/> The answer is: ${answer}  &#9888;&#65039;`;
        }else{
            if(isNaN(answer)){
                if (answer.toLowerCase() == document.getElementById("input").value.toLowerCase()) {
                        console.log(functionRun);
                        points++;
                        if(data[rand].points < 3){
                            data[rand].points++;
                        }
                        pop();
                        
                        let idName = "el" + (rand+1);
                        let AidName = idName + "a"
                        console.log(idName)
                        console.log(data[rand].points + " On..." + (rand + 1));
                        let element = document.getElementById(idName);
                        element.style.visibility = "visible";
                        document.getElementById(AidName).style.visibility = "hidden";
                        `<b> You have ${points} point(s)!</b>`;
                        document.getElementById("result").innerHTML = rightMessage(points);
                }else{
                    document.getElementById("result").innerHTML = wrongMessage(answer);
                    let idName = "el" + (rand+1);
                        let AidName = idName + "a"
                        let element = document.getElementById(idName);
                        element.style.visibility = "hidden";
                        document.getElementById(AidName).style.visibility = "visible";
                        console.log(element.style.visibility)
                    if(data[rand].points > 0){
                        points--;
                        data[rand].points --;
                        console.log(data[rand].points);
                    }
                }
                document.getElementById("input").value = "";
            }else{
                if (answer == document.getElementById("input").value) {
                        console.log(functionRun);
                        points++;
                        if(data[rand].points < 3){
                            data[rand].points++;
                        }
                        pop();
                        let idName = "el" + (rand+1);
                        let AidName = idName + "a"
                        console.log(idName)
                        console.log(data[rand].points + " On..." + (rand + 1));
                        let element = document.getElementById(idName);
                        element.style.visibility = "visible";
                        document.getElementById(AidName).style.visibility = "hidden";
                        document.getElementById("result").innerHTML = rightMessage(points);
                }else{
                    document.getElementById("result").innerHTML = wrongMessage(answer);
                    let idName = "el" + (rand+1);
                        let AidName = idName + "a"
                        let element = document.getElementById(idName);
                        element.style.visibility = "hidden";
                        document.getElementById(AidName).style.visibility = "visible";
                        console.log(element.style.visibility)
                    if(data[rand].points > 0){
                        points--;
                        data[rand].points --;
                        console.log(data[rand].points);
                    }
                }
                document.getElementById("input").value = ""; 
            }
        }
    }
    questionNum = Math.floor(Math.random() * data[0].questionAndPoints.length);
    rand = Math.floor(Math.random() * data.length);
    randQuestionAndPoints = data[rand].questionAndPoints;
    question = randQuestionAndPoints[questionNum].question;
    answer = randQuestionAndPoints[questionNum].answer;
    //console.log(rand + " " + answer);
    //console.log(questionNum);
    document.getElementById("question").innerHTML = `${question}`;
    functionRun++;
    
}
