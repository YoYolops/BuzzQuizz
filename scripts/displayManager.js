
/** 
 * Makes a target div visible and hide all the others;
 * @param {String}  targetScreen the screen that should be displayed (first, second or third)
 */
function switchScreen(targetScreen) {
    const idName = targetScreen + "-screen";
    document.querySelector(".visible").className = "hidden";
    document.querySelector(`#${idName}`).className = "visible";
}

function generateQuizzCardHtml(quizz) {
    const {title, image, id} = quizz;
    const template = (
        `<div id="quizz-${id}"  class="quizz-banner" onclick="startQuizz(this)"  style="background: linear-gradient(0deg, rgba(0,0,0,0.9) 0%, rgba(251,251,251,0) 60%), url(${image}) no-repeat; background-size: cover; background-repeat: no-repeat; background-position: center">
            <p class="quizz-title">${title}</p>
        </div>`
    )
    return template;
}

function displayQuizzQuestions(quizz) {
    const questions = generateQuizzQuestionsHtml(quizz);
    const questionsContainer = document.querySelector(".quizz-container");

    for(question of questions) {
        questionsContainer.innerHTML += question;
    }
}


/** 
 * Generates a proper html for each quizz question
 * @param {Object} quizz
 * @return {Array} an array with all the quizz's HTMLs
 */
function generateQuizzQuestionsHtml(quizz) {
    const { questions } = quizz;
    const allQuestions = questions.map(question => {
        const answerBoxes = generateQuizAnswerBoxesHtml(question.answers);
        const questionTemplate = (
            `<div class="question-container">
                <header class="question-header" style="background-color: ${question.color};">
                    <p>${question.title}</p>
                </header>
                <div class="answers-container">
                    ${answerBoxes}
                </div>
            </div>`
        )
        return questionTemplate;
    })
    return allQuestions;
}

function generateQuizAnswerBoxesHtml(answers) {
    let template = "";
    const answersShuffled = shuffleArray(answers, answers.length);

    for(answer of answersShuffled) {
        const answerBox = (
            `<div class="answer-box ${answer.isCorrectAnswer ? "correct" : "incorrect"}" onclick="selectAnswer(this)">
                <div class="img" style="background-image: url('${answer.image}'); background-size: cover; background-repeat: no-repeat; background-position: center; background-position: center"></div>
                <p>${answer.text}</p>
            </div>`
        )
        template += answerBox
    }
    return template;
}

/** 
 * Display the quizzes on aproppriate place
 */
function displayQuizzes() {
    for(quizz of GLOBAL.serverQuizzes) {
        const quizzBanner = generateQuizzCardHtml(quizz);
        
        isThisAUsersQuizz(quizz.id)
            ? document.querySelector(".users-quizzes-section .banners-container").insertAdjacentHTML("beforeend", quizzBanner)
            : document.querySelector(".all-quizzes-section .banners-container").insertAdjacentHTML("beforeend", quizzBanner);
    }
    manageEmptyUsersQuizzInterface();
}

/** 
 * Check if the quiz id matches any locally loaded
 * @param {Object} quizzID quiz standard object that comes from backend 
 * @return {boolean} true with it matches, false otherwise
 */
function isThisAUsersQuizz(quizzID) {
    for(id of GLOBAL.usersQuizzesIds) {
        if(id === quizzID) return true;
    }
    return false;
}


/** 
 * Check with there are any users quizzes registered, displaying the appropriate one
 */
function manageEmptyUsersQuizzInterface() {
    if(GLOBAL.usersQuizzesIds.length === 0) {
        document.querySelector(".user-quizzes-section").className = "hidden";
        document.querySelector("#empty-user-quizz").className = "";
    } else {
        document.querySelector("#empty-user-quizz").className = "hidden";
        document.querySelector(".user-quizzes-section").className = "";
    }
}

/** 
 * Select a clicked answer, verify if it is correct and calculates the score according
 * @param {Node} element a clicked .answer-box
 */
function selectAnswer(selectedAnswerElement) {
    selectedAnswerElement.classList.contains("correct")
        ? GLOBAL.score += 1
        : void(0);
    
    colorizeAnswers(selectedAnswerElement.parentNode, selectedAnswerElement);
}

/** 
 * Sets p tags color to red in wrong answer, green in right answers. remove answer-boxes onclick events
 * and fades the other answers
 * @param {Node} element the answer-box-container
 */
function colorizeAnswers(element, selectedAnswerElement) {
    const allAnswerElements = element.querySelectorAll(".answer-box");

    for(answerElement of allAnswerElements) {
        answerElement.classList.contains("correct")
            ? answerElement.querySelector("p").style.color = "#009C22"
            : answerElement.querySelector("p").style.color = "#FF0B0B";
        
        answerElement === selectedAnswerElement
            ? void(0)
            : answerElement.style.opacity = "0.3";


        removeOnclickEvent(answerElement);
    }
}


function removeOnclickEvent(element) {
    element.onclick = "";
}

/*Third-screen*/

/*Change to create-questions*/

function changeToCreateQuestions () {
    const basicInformationQuizz = savingBasicQuizzInformation();
    console.log(basicInformationQuizz.title.length)
    let numCharOk;
    let urlOk;
    let nQuestionsOk;
    let nLevelsOk;
    
    if (basicInformationQuizz.title.length >= 20 && basicInformationQuizz.title.length <= 65) {
        numCharOk = true;
    }
    if (isValidHttpUrl(basicInformationQuizz.image)) {
        urlOk = true;
        
    }
    if (basicInformationQuizz.nQuestions >=3) {
        nQuestionsOk = true;
    }
    if (basicInformationQuizz.nLevels >=2) {
        nLevelsOk = true;
    }

    if (numCharOk && urlOk && nQuestionsOk && nLevelsOk) {
        console.log("Pode ir pra proxima etapa");
    }

}

function isValidHttpUrl(string) {
    let url;
    
    try {
      url = new URL(string);
    } catch (_) {
      return false;  
    }
  
    return url.protocol === "http:" || url.protocol === "https:";
  }

