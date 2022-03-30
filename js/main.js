//all the logic
let functionRun = 0;
let rand = Math.floor(Math.random() * data.length);
let randQuestionAndPoints = data[rand].questionAndPoints;
let questionNum = Math.floor(Math.random() * randQuestionAndPoints.length);
let question = randQuestionAndPoints[questionNum].question;
let answer = randQuestionAndPoints[questionNum].answer;
let inputElement = document.getElementById("showAndHide");
inputElement.style.display =  "none";
let points = 0
$(document).ready(function(){
    $("#myModal").modal('show');
});
function wrongMessage (answer) {
    answer = randQuestionAndPoints[questionNum].answer;
    let message = ` <div class="alert alert-danger alert-dismissible fade show" role="alert"> <b>You got the last question incorrect.<br/> The answer is: __ANSWER__ &#129300;</b><button type="button" class="close" data-dismiss="alert" aria-label="Close">
    <span aria-hidden="True">&times;</span>
  </button></div>`;
    return message.replace("__ANSWER__", answer);
}
function rightMessage (points) {
    let message = `<div class="alert alert-success alert-dismissible fade show" role="alert"><b> You got the last question correct!</b><br/><b> You have __POINTS__ point(s)! &#128077;</b><button type="button" class="close" data-dismiss="alert" aria-label="Close">
    <span aria-hidden="True">&times;</span>
  </button></div>`;
    return message.replace("__POINTS__", points);
}

function handleRightAnswer(questionNumber, points) {
    pop()
    let idName = "#el" + (questionNumber+1)
    let aidName = idName + "a"
    $(idName).removeClass("hidden-element")
    $(idName).removeClass("element-no-transition")
    $(idName).addClass("element")
    $(aidName).removeClass("visible-span")
    $(aidName).addClass("hidden-element")
    $("#result").html(rightMessage(points))
}

function handleWrongAnswer(questionNumber, points) {
    let idName = "#el" + (questionNumber+1)
    let aidName = idName + "a"
    $(idName).addClass("hidden-element")
    $(idName).addClass("element-no-transition")
    $(idName).removeClass("element")
    $(aidName).removeClass("hidden-element")
    $(aidName).addClass("visible-span")
    $("#result").html(wrongMessage(points))
}

function nextQuestion () {
    inputElement.style.display = "block";
    $("#next").html("Continue").removeClass("big");
    
    if(functionRun > 0){
        if($("#input").val() == ""){
            $("#result").html(`<div class="alert alert-warning alert-dismissible fade show" role="alert">You did not answer the last question!<br/> The answer is: ${answer}  &#9888;&#65039;<button type="button" class="close" data-dismiss="alert" aria-label="Close">
            <span aria-hidden="True">&times;</span>
          </button></div>`);
        } else{
            if(isNaN(answer)){
                if (answer.toLowerCase() == $("#input").val().toLowerCase()) {
                    points++
                    if(data[rand].points < questionNum){
                        data[rand].points++
                    }
                    handleRightAnswer(rand, points)
                } else {
                    handleWrongAnswer(rand, points)
                    if(data[rand].points > 0){
                        points--
                        data[rand].points--
                    }
                }
            } else {
                if (answer == $("#input").val()) {
                    points++;
                    if(data[rand].points < questionNum){
                        data[rand].points++;
                    }
                    handleRightAnswer(rand, points)
                } else {
                    handleWrongAnswer(rand, points)
                    if(data[rand].points > 0){
                        points--
                        data[rand].points--
                    }
                }
            }
            $("#input").val("")
        }
    }
    rand = Math.floor(Math.random() * data.length)
    randQuestionAndPoints = data[rand].questionAndPoints
    questionNum = Math.floor(Math.random() * randQuestionAndPoints.length)
    question = randQuestionAndPoints[questionNum].question
    answer = randQuestionAndPoints[questionNum].answer
    $("#question").html(`${question}`)
    functionRun++
    
}
