//making lots of VARIBLES. NUM NUM NUM
let questionsAnsweredArray = {}
let question
let questionNumber = 7


function onLoad() {
    if(localStorage.getItem("progress") === null) {
        localStorage.setItem("progress", "")
    }else{
        let savedProgress  = JSON.parse(localStorage.getItem("progress"))
        questionsAnsweredArray = savedProgress
    }
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
    console.log(JSON.parse(localStorage.getItem("progress")))
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
        answerInputed = answerInputed.toLowerCase()
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

        $("#arrayText").append(`Your overall score for this element is ${score}/8`)

        for(let i=0; i< qaArray.length; i++) {
            let curText = `<br/> Question: ${qaArray[i]['question']}`
            curText += `<br/> Answer: ${qaArray[i]['answer']}`
            curText += `<br/> Is Correct: ${qaArray[i]['isCorrect']} <br/>`
            $("#arrayText").append(`<li class="list-group-item arrayList">${curText}</li>`)
        }
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

function makeData() {
    

}
