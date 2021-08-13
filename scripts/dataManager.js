
async function getServerQuizzes() {
    const response = await GLOBAL.api.get("/").catch(error => {
        console.log("Erro na requisição");
        console.log(error);
        return false;
    })
    GLOBAL.serverQuizzes = response.data;
}


function loadLocallyStoragedQuizzes() {
    const localQuizzes = localStorage.getItem("BuzzQuizz");

    if(localQuizzes) {
        GLOBAL.usersQuizzesIds = JSON.parse(localQuizzes);
    } else {
        GLOBAL.usersQuizzesIds = [];
    }
}


function storeUsersQuizzesLocally() {
    const storeQuizzes = JSON.stringify(GLOBAL.usersQuizzesIds);
    localStorage.setItem("BuzzQuizz", storeQuizzes);
}

/** 
 * Search quizz by id number in GLOBAL.serverQuizzes
 * @param {Number} id
 * @return {Object} the matching quizz, null if none was found
 */
function searchQuizzById(id) {
    for(quizz of GLOBAL.serverQuizzes) {
        if(quizz.id.toString() === id) {
            return quizz;
        }
    }
    return null;
}





/** 
 * Fisher-Yates algorithm, wich randomly shuffles an array (https://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle)
 * @param {String[]} array the array that will me shuffled
 * @param {Number} length how many items must be shuffled
 * @return {String[]} the shuffled array with the specified length
 */
 function shuffleArray(array, length) {
    const shuffledArray = [];
    const inputArrayCopy = Array.from(array);

    for(let i = 0; i < length; i++) {
        const selectedIndex = Math.floor(Math.random() * (inputArrayCopy.length - 0) + 0);
        shuffledArray[i] = inputArrayCopy[selectedIndex];

        inputArrayCopy.splice(selectedIndex, 1);
    }
    return shuffledArray;
}


function savingBasicQuizzInformation () {
    const findBasicInformation = document.querySelector(".basic-information-quizz .main-step-quizz ");

    const basicInformation = {
        title: findBasicInformation.querySelectorAll("input")[0].value,
        image: findBasicInformation.querySelectorAll("input")[1].value,
        nQuestions: Number(findBasicInformation.querySelectorAll("input")[2].value),
        nLevels: Number(findBasicInformation.querySelectorAll("input")[3].value)
    }

    return basicInformation
}

/** 
 * Manufacture the necessary data to display the ending banner, based on users hits
 * @return {object} all the data needed to render the final stats
 */
function manufactureEndingQuizzData() {
    const score = GLOBAL.runningQuizzInfo.score;
    const questionsAmmount = GLOBAL.runningQuizzInfo.quizz.questions.length;
    const hitPercentage = Math.floor((100/questionsAmmount) * score);

    let properLevel;
    for(level of GLOBAL.runningQuizzInfo.quizz.levels) {
        if(hitPercentage >= Number(level.minValue)) { properLevel = level }
        else { break };
    }

    properLevel = properLevel || GLOBAL.runningQuizzInfo.quizz.levels[0]; // if not achieved any goal, return the first level by default

    return ({
        title: `${hitPercentage}% de acerto: ${properLevel.title}`,
        image: properLevel.image,
        text: properLevel.text,
    })
}
