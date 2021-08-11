
/** 
 * Makes a target div visible and hide all the others;
 * @param {String}  targetScreen the screen that should be displayed (first, second or third)
 */
function switchScreen(targetScreen) {
    const idName = targetScreen + "-screen";
    document.querySelector(".visible").className = "hidden";
    document.querySelector(`#${idName}`).className = "visible";
}

function generateQuizzBannerHtml(quizz) {
    const {title, image, id} = quizz;
    const template = (
        `<div id="quizz-${id}"  class="quizz-banner" onclick="startQuizz(this)"  style="background: linear-gradient(0deg, rgba(0,0,0,0.9) 0%, rgba(251,251,251,0) 60%), url(${image}) no-repeat;">
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

    for(answer of answers) {
        const answerBox = (
            `<div class="answer-box">
                <img src="${answer.image}">
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
        const quizzBanner = generateQuizzBannerHtml(quizz);
        
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
 * Check with there are any users quizzes registered, displayng the appropriate
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

