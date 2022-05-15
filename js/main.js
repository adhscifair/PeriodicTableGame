let questionsAnsweredArray = {}
let question
let questionNumber = 0
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
    $("#myModal").modal("show");
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
    let alreadyExists = false
    let ifPrevAnswerCorrect = false
    questionsAnsweredArray[elementName].QA.forEach((q, index)=>{
        if(q.question == question) {
            ifPrevAnswerCorrect = q.isCorrect
            questionsAnsweredArray[elementName].QA[index] = curQA
            alreadyExists = true
        }
    })

    if(!alreadyExists) {
        questionsAnsweredArray[elementName].QA.push(curQA)
        if(isCorrect) {
            questionsAnsweredArray[elementName]['score']++
        }
    } else { //check and adjust the score if this was previously answered wrong
        if(!ifPrevAnswerCorrect && isCorrect) {
            questionsAnsweredArray[elementName]['score']++
        } else if(ifPrevAnswerCorrect && !isCorrect) {
            questionsAnsweredArray[elementName]['score']--
        }
    }

    localStorage.setItem("progress", JSON.stringify(questionsAnsweredArray))
    $("#arrayText").append(JSON.stringify(questionsAnsweredArray))    
}

function resetForNextQuestion() {
    $("#input").val("")
    questionNumber--
    if(questionNumber >= 0) {
        question = data[arrayNumber].questionAndPoints[questionNumber].question
        $("#questionBody").html(question)
        let width = (1/data[arrayNumber].questionAndPoints.length)*100
        $(".progress").append(`
          <div  
          id= "progressBar${questionNumber}" 
          class="progress-bar" 
          role="progressbar" 
          style="width: ${width}%" 
          aria-valuenow="0" 
          aria-valuemin="0" 
          aria-valuemax="100"></div>
        `)
    }
}

function checkAnswer(answerInputed, correctAnswer) {
    if(typeof correctAnswer === 'string' && typeof correctAnswer === 'string' && question.includes("abbreviation") == false) {
        answerInputed = answerInputed.toLowerCase()
        correctAnswer = correctAnswer.toLowerCase()
    }
    return answerInputed == correctAnswer
}

function handleEmptyAnswer() {
    $("#quickMessage").html(
        `<br/><div class="alert alert-warning" role="alert">
            Please answer the question to proceed. 
        </div>
        
    `)
    $("#questionBody").html(question)
}

function displaySuccessMessage() {
    $("#quickMessage").html(
        `<br/>
        <div class="alert alert-success" role="alert">
            Great job! You got the last question correct!
        </div>`
    )
}

function displayFailureMessage(correctAnswer) {
    $("#quickMessage").html(
        `<br/><div class="alert alert-danger" role="alert">
            You got the last question incorrect. The answer was ${correctAnswer}.
            <br/> Their is always next time!
        </div>
    `)
}

function handleCompletedElement(elementName) {
    let score = questionsAnsweredArray[elementName].score
    if(score/data[arrayNumber].questionAndPoints.length >= 0.5) {
        pop()
    }
    $("#questionBody").html(`You have answered ${score}/${data[arrayNumber].questionAndPoints.length} questions correctly!!`)
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
        $("#score").text('')
        
        let curArray = questionsAnsweredArray[elementName]
        let score = curArray['score']
        let qaArray = curArray['QA']
        let denominator = data[arrayNumber].questionAndPoints.length

        $("#score").append(`<div><h2 style="text-align:center">Score: ${score}/${denominator} <br/> Percentage: ${Math.round(score/denominator * 100)}%</h2></div> <hr/> <br/>`)
        let arrayTextHtml = `<tr><th>Questions<th/><th></th><tbody>`
        for(let i=0; i< qaArray.length; i+=2) {
            arrayTextHtml += `<tr>`

            for(let j=0; j<2; j++) {
                let curText = ''
                if((i+j) < qaArray.length) {
                    if(qaArray[i+j]['isCorrect']){
                        icon = `<img src="./pictures/correct.png" alt="Correct!" width = "40px">`
                    }else{
                        icon = `<img src="./pictures/incorrect.png" alt="Incorrect!" width = "40px">`
                    }
                    curText = `<br/> <h5>Question: ${qaArray[i+j]['question']} </h5>`
                    curText += `<h6>Your answer: ${qaArray[i+j]['answer']} ${icon}</h6>`
                }
                arrayTextHtml += `<td>${curText}</td>`
            }
            arrayTextHtml += `</tr>`
        }
        arrayTextHtml += `</tbody></tr>`
        $("#arrayText").append(arrayTextHtml)
    } else {
        $("#quickNote").text('Answer a question to see your progress!')
        $('#quickNote').show()
        $("#arrayText").text('')
        $("#score").text('')
    }
}


function displayModal (clicked_id) {
    $("#congratMessage").hide()
    //setting up the arrayNumber it should call in data.js using the id.
    arrayNumber = parseInt(clicked_id.slice(2)) - 1
    $(".progress").html("");
    let title = data[arrayNumber].elementName

    //making the modal show up
    $("#questionModal").modal('show')
    document.getElementById("questionModalLabel").innerHTML = title
    $("#quickMessage").show()
    $("#questionInputBody").show()
    $("#score").html("")
    questionNumber = data[arrayNumber].questionAndPoints.length - 1

    
    question = data[arrayNumber].questionAndPoints[questionNumber].question

    document.getElementById("questionBody").innerHTML = question
    let width = (1/data[arrayNumber].questionAndPoints.length)*100
    displayProgress(title)
    $(".progress").append(`
      <div  id= "progressBar${questionNumber}" class="progress-bar" role="progressbar" style="width: ${width}%" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"></div>
    `)
    $("#quickMessage").html("")
}

function evaluateAnswer(){
   let elementName = data[arrayNumber].elementName
    if(questionNumber >= 0) {
        answerInputed = $("#input").val()
        correctAnswer = data[arrayNumber].questionAndPoints[questionNumber].answer
        question = data[arrayNumber].questionAndPoints[questionNumber].question
        let width = (1/data[arrayNumber].questionAndPoints.length)*100
        if(answerInputed == "") { // if empty answer
            handleEmptyAnswer()
            $(`#progressBar${questionNumber}`).replaceWith(`
                <div id= "progressBar${questionNumber}" class="progress-bar bg-warning" role="progressbar" style="width: ${width}%" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"></div>
                `)
        } else {
            if(checkAnswer(answerInputed, correctAnswer)) { //right answer
                storeQA(elementName, question, answerInputed, true)
                displaySuccessMessage()
                $(`#progressBar${questionNumber}`).replaceWith(`
                <div class="progress-bar bg-success" role="progressbar" style="width: ${width}%" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"></div>
                `)
                resetForNextQuestion()
            } else { //wrong answer
                storeQA(elementName, question, answerInputed, false)
                displayFailureMessage(correctAnswer)
                $(`#progressBar${questionNumber}`).replaceWith(`
                <div class="progress-bar bg-danger" role="progressbar" style="width: ${width}%" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"></div>
                `)
                resetForNextQuestion()
            }
        }

    }
    if(questionNumber < 0) {
        handleCompletedElement(elementName)
    }
    displayProgress(elementName)
    
}
