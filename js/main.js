//making lots of VARIBLES. NUM NUM NUM
let questionsAnsweredArray = {}
let question
let questionNumber = 7
let icon;

function onLoad() {
    if(localStorage.getItem("progress") === null) {
        localStorage.setItem("progress", "")
    }else{
        if(localStorage.getItem("progress") != ""){
            let savedProgress  = JSON.parse(localStorage.getItem("progress"))
            questionsAnsweredArray = savedProgress
        }
    }
    $("#exampleModal").modal("show");
}

function checkAndInitializeQAarray(elementName) {
    if(!questionsAnsweredArray[elementName]) {
        let object = {
            'name': elementName, 
            'QA': [],
            'score': 0
        }
        questionsAnsweredArray[elementName] = object
        
    } 
}

function storeQA(elementName, question, answer, isCorrect) {
    checkAndInitializeQAarray(elementName)
    let curQA = {}
    curQA['question'] = question
    curQA['answer'] = answer
    curQA['isCorrect'] = isCorrect
    questionsAnsweredArray[elementName].QA.push(curQA)
    if(isCorrect) {
        let curScore = questionsAnsweredArray[elementName]['score'] + 1
        questionsAnsweredArray[elementName]['score'] = curScore
    }
    localStorage.setItem("progress", JSON.stringify(questionsAnsweredArray))
    $("#arrayText").append(JSON.stringify(questionsAnsweredArray))
}


function resetForNextElement() {
    questionNumber = 7
}

function resetForNextQuestion() {
    $("#input").val("")
    questionNumber--
    if(questionNumber >= 0) {
        question = data[arrayNumber].questionAndPoints[questionNumber].question
        $("#questionBody").html(question)
    }
}

function checkAnswer(answerInputed, correctAnswer) {
    if(questionNumber == 1) {
        answerInputed = answerInputed.toLowerCase();
    }else if( questionNumber == 7 || questionNumber == 3 || arrayNumber == 118){
        answerInputed = answerInputed.toLowerCase()
        correctAnswer = correctAnswer.toLowerCase()
    }
    return answerInputed == correctAnswer
}

function handleEmptyAnswer() {
    $("#quickMessage").html(`
        <div class="alert alert-warning" role="alert">
            Please answer the question to proceed. 
        </div>
        
    `)
    $("#questionBody").html(question)
}

function displaySuccessMessage() {
    $("#quickMessage").html(
        `<div class="alert alert-success" role="alert">
            Great job! You got the last question correct!
        </div>`
    )
}

function displayFailureMessage(correctAnswer) {
    $("#quickMessage").html(`
        <div class="alert alert-danger" role="alert">
            You got the last question incorrect. The answer was ${correctAnswer}.
            <br/> Their is always next time!
        </div>
    `)
}

function handleCompletedElement(elementName) {
    let score = questionsAnsweredArray[elementName].score
    if(score >= 4) {
        pop()
    }
    $("#questionBody").html(`You have answered ${score}/8 questions correctly!!`)
    $("#quickMessage").hide()
    $("#quickMessage").text("")
    $("#questionInputBody").hide()
    $("#quickNote").hide()
}

function displayProgress(elementName) {
    if(questionsAnsweredArray[elementName]
        && questionsAnsweredArray[elementName]['QA'].length > 0) {
        $("#quickNote").text('')
        $("#arrayText").text('')
        let curArray = questionsAnsweredArray[elementName]
        let score = curArray['score']
        let qaArray = curArray['QA']
        let tableRow1 = '<tr></tr>'
        let tableRow2 = '<tr></tr>'
        let tableRow3 = '<tr></tr>'
        let tableRow4 = '<tr></tr>'
        $("#arrayText").append(`<div class="card"><h2 style="text-align:center">Score: ${score}/8</h2></div> <hr/> <br/>`)
        
        for(let i=0; i< qaArray.length; i++) {
            if(qaArray[i]['isCorrect']){
                icon = `<img src="./pictures/correct.png" alt="Correct!" width = "40px">`
            }else{
                icon = `<img src="./pictures/incorrect.png" alt="Incorrect!" width = "40px">`
            }
            let curText = `<br/> <h5>Question: ${qaArray[i]['question']} </h5>`
            curText += `<h6>Your answer: ${qaArray[i]['answer']} ${icon}</h6>`
            if(i == 0){
                tableRow1 += `<td>${curText}</td>`
            }else if(i==1) {
                tableRow2 += `<td>${curText}</td>`
            }else if(i==2){
                tableRow3 += `<td>${curText}</td>`
            }else if(i==3){
                tableRow4 += `<td>${curText}</td>`
            }else if(i==4){
                tableRow1 += `<td>${curText}</td>`
            }else if(i==5){
                tableRow2 += `<td>${curText}</td>`
            }else if(i==6){
                tableRow3 += `<td>${curText}</td>`
            }else if(i==7){
                tableRow4 += `<td>${curText}</td>`
            }
        }
        let arrayTextHtml = `<tr><th>Questions<th/><th></th><tbody>${tableRow1}${tableRow2}${tableRow3}${tableRow4}</tbody></tr>`
        $("#arrayText").append(arrayTextHtml)
    } else {
        $("#quickNote").text('Answer a question to see your progress!')
        $('#quickNote').show()
        $("#arrayText").text('')
    }
}


function displayModal (clicked_id) {
      
    resetForNextElement()

    $("#congratMessage").hide()
    //setting up the arrayNumber it should call in data.js using the id.
    arrayNumber = parseInt(clicked_id.slice(2)) - 1

    let title = data[arrayNumber].elementName

    //making the modal show up
    $("#questionModal").modal('show')
    document.getElementById("questionModalLabel").innerHTML = title
    $("#quickMessage").show()
    $("#questionInputBody").show()
    question = data[arrayNumber].questionAndPoints[questionNumber].question

    document.getElementById("questionBody").innerHTML = question

    displayProgress(title)
}

function evaluateAnswer(){
   let elementName = data[arrayNumber].elementName
    if(questionNumber >= 0) {
        answerInputed = $("#input").val()
        correctAnswer = data[arrayNumber].questionAndPoints[questionNumber].answer
        question = data[arrayNumber].questionAndPoints[questionNumber].question
        if(answerInputed == "") { // if empty answer
            handleEmptyAnswer()
        } else {
            if(checkAnswer(answerInputed, correctAnswer)) { //right answer
                storeQA(elementName, question, answerInputed, true)
                displaySuccessMessage()
                resetForNextQuestion()
            } else { //wrong answer
                storeQA(elementName, question, answerInputed, false)
                displayFailureMessage(correctAnswer)
                resetForNextQuestion()
            }
        }

    }
    if(questionNumber < 0) {
        handleCompletedElement(elementName)
    }
    displayProgress(elementName)
    
}
