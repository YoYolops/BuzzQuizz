
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

function resetGlobalRunnigQuizzInfo(newObject) {
    if(newObject) { GLOBAL.runningQuizzInfo = newObject }
    else {
        GLOBAL.runningQuizzInfo = {
            score: 0,
            quizz: {},
            answeredAmmount: 0
        }
    }
}

function resetSecondScreenInterface() {
    document.querySelector("#second-screen > .quizz-container").innerHTML = "";
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
    const findBasicInformation = document.querySelector("#basic-information-quizz-screen .main-step-quizz ");

    const basicInformation = {
        title: findBasicInformation.querySelectorAll("input")[0].value,
        image: findBasicInformation.querySelectorAll("input")[1].value,
        nQuestions: Number(findBasicInformation.querySelectorAll("input")[2].value),
        nLevels: Number(findBasicInformation.querySelectorAll("input")[3].value)
    }

    return basicInformation;
}

function savingQuizzQuestions (nQuestions) {
    nQuestions = 5;
    const MyQuizzQuestions = [];
    let questions = [];
    let answers =[];
    const findMyQuizzQuestions = document.querySelector(".questions-setup");
    
    
    for(let i=1; i<= nQuestions ; i++) {

        answers = [
            {
                text: findMyQuizzQuestions.querySelectorAll(`.pergunta-create-${i} .correct-answer input`)[0].value,
                image: findMyQuizzQuestions.querySelectorAll(`.pergunta-create-${i} .correct-answer input`)[1].value,
                isCorrectAnswer: true
            }
    ];
        for(let j=0; j<3; j+=2) {

            const wrongAnswer = {
                text: findMyQuizzQuestions.querySelectorAll(`.pergunta-create-${i} .wrong-answers input`)[j].value,
                image: findMyQuizzQuestions.querySelectorAll(`.pergunta-create-${i} .wrong-answers input`)[j+1].value,
                isCorrectAnswer: false
            }
            if (wrongAnswer.text !==null || wrongAnswer.image !==null) {
                answers.push(wrongAnswer);
            }
            
        }
        questions = [
                {
                title: findMyQuizzQuestions.querySelectorAll(`.pergunta-create-${i} .pergunta input`)[0].value,
                color: findMyQuizzQuestions.querySelectorAll(`.pergunta-create-${i} .pergunta input`)[1].value,
                answers: answers
                }
            ]

        MyQuizzQuestions.push(questions)
    }
    console.log(MyQuizzQuestions);
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
