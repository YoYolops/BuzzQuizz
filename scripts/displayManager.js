
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
    const {title, image} = quizz;
    const template = (
        `<div class="quizz-banner" style="background: linear-gradient(0deg, rgba(0,0,0,0.9) 0%, rgba(251,251,251,0) 60%), url(${image}) no-repeat;">
            <p class="quizz-title">${title}</p>
        </div>`
    )
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
}

/** 
 * Check if the quiz id matches any locally loaded
 * @return {boolean} true with it matches, false otherwise
 */
function isThisAUsersQuizz(quizzID) {
    for(id of GLOBAL.usersQuizzesIds) {
        if(id === quizzID) return true;
    }
    return false;
}