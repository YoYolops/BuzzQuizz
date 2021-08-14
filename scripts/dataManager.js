
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
    const findBasicInformation = document.querySelector("#basic-information-quizz-screen .main-step-quizz ");

    const basicInformation = {
        title: findBasicInformation.querySelectorAll("input")[0].value,
        image: findBasicInformation.querySelectorAll("input")[1].value,
        nQuestions: Number(findBasicInformation.querySelectorAll("input")[2].value),
        nLevels: Number(findBasicInformation.querySelectorAll("input")[3].value)
    }

    return basicInformation;
}

function savingQuizzQuestions () {
    let nQuestions = savingBasicQuizzInformation ().nQuestions;
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
            },
            {
                text: findMyQuizzQuestions.querySelectorAll(`.pergunta-create-${i} .wrong-answers input`)[0].value,
                image: findMyQuizzQuestions.querySelectorAll(`.pergunta-create-${i} .wrong-answers input`)[1].value,
                isCorrectAnswer: false
            }
            
    ];
        for(let j=2; j<=4; j+=2) {

            const wrongAnswer = {
                text: findMyQuizzQuestions.querySelectorAll(`.pergunta-create-${i} .wrong-answers input`)[j].value,
                image: findMyQuizzQuestions.querySelectorAll(`.pergunta-create-${i} .wrong-answers input`)[j+1].value,
                isCorrectAnswer: false
            }
            if (wrongAnswer.text !=='' || wrongAnswer.image !=='') {
                answers.push(wrongAnswer);
            }
            
        }
        questions = {
                title: findMyQuizzQuestions.querySelectorAll(`.pergunta-create-${i} .pergunta input`)[0].value,
                color: findMyQuizzQuestions.querySelectorAll(`.pergunta-create-${i} .pergunta input`)[1].value,
                answers: answers
                }
            

        MyQuizzQuestions.push(questions)
    }
    console.log(MyQuizzQuestions);
    validateQuestions(MyQuizzQuestions);
}



function validateQuestions(MyQuizzQuestions) {

    let questionsOk = true;
    MyQuizzQuestions.forEach((elemento) => {
          
        if(elemento.title.length < 20) {
            console.log("erro no titulo");
            questionsOk = false;
        }
        
        elemento.answers.forEach((resposta) => {
            if(resposta.text.length === 0) {
                console.log("erro texto");
                questionsOk = false;
            }
            if(isValidHttpUrl(resposta.image) ===false) {
                console.log("erro na imagem");
                questionsOk = false;
            }
        }
        )
        
        
    });
    console.log(questionsOk)
    



    
}


