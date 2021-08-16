
async function getServerQuizzes() {
    const response = await GLOBAL.api.get("/").catch(error => {
        console.log(error);
        return false;
    })
    GLOBAL.serverQuizzes = response.data;
}


function loadLocallyStoragedQuizzes() {
    const localQuizzesIds = JSON.parse(localStorage.getItem("BuzzQuizz"));

    if(localQuizzesIds) {
        GLOBAL.usersQuizzesIds = localQuizzesIds.userQuizzesIds;
    } else {
        GLOBAL.usersQuizzesIds = [];
    }
}


function storeUsersQuizzesLocally() {
    const quizzesIds = GLOBAL.usersQuizzesIds;
    const storeQuizzes = JSON.stringify({ userQuizzesIds: quizzesIds });
    localStorage.setItem("BuzzQuizz", storeQuizzes);
}

/** 
 * Search quizz by id number in GLOBAL.serverQuizzes
 * @param {Number} id
 * @return {Object} the matching quizz, null if none was found
 */
function searchQuizzById(id) {
    for(quizz of GLOBAL.serverQuizzes) {
        if(quizz.id.toString() === id || Number(quizz.id) === id) {
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

function resetScreenInterface(queryString) {
    document.querySelector(queryString).innerHTML = "";
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

/** 
 * Checks if a string is a valid hexadecimal color acepted by CSS
 * @param hexadecimalString {String} the string to be checked
 * @return {boolean} true if it is valid, false otherwise
 */
function isValidHexadecimalColor(hexadecimalString) {
    const validCharacters = ["a", "b", "c", "d", "e", "f","1","2","3","4","5","6","7","8","9"];

    for(let i = 1; i < hexadecimalString.length; i++) {
        if(!validCharacters.includes(hexadecimalString[i].toLowerCase())) return false;
    }

    const conditions = [
        hexadecimalString.length === 7,
        hexadecimalString[0] === '#',
    ]

    for(condition of conditions) { if(!condition) return false; }

    
}


function savingBasicQuizzInformation () {
    const findBasicInformation = document.querySelector("#basic-information-quizz-screen .main-step-quizz ");

    const basicInformation = {
        title: findBasicInformation.querySelectorAll("input")[0].value,
        image: findBasicInformation.querySelectorAll("input")[1].value,
        nQuestions: Number(findBasicInformation.querySelectorAll("input")[2].value),
        nLevels: Number(findBasicInformation.querySelectorAll("input")[3].value)
    }


    GLOBAL.quizzFinished.title = basicInformation.title;
    GLOBAL.quizzFinished.image = basicInformation.image;

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

function validateQuestions(MyQuizzQuestions) {

    let questionsOk = true;
    MyQuizzQuestions.forEach((elemento) => {
          
        if(elemento.title.length < 20) {
            console.log("erro no titulo");
            questionsOk = false;
        }

        if(isValidHexadecimalColor(elemento.color) === false) {
            questionsOk = false;
            console.log("Erro na color")
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

    levelsScreenDisplay(questionsOk);

    GLOBAL.quizzFinished.questions = MyQuizzQuestions;
    
}

function savingQuizzLevels () {
    let nLevels = savingBasicQuizzInformation ().nLevels;
    let levels = [];
    let level;
    const findMyQuizzLevels = document.querySelector(".levels-setup");

    for(let i=1; i<= nLevels ; i++) {

        level = {
			title: findMyQuizzLevels.querySelectorAll(`.level-create-${i} .level-config input`)[0].value,
			image: findMyQuizzLevels.querySelectorAll(`.level-create-${i} .level-config input`)[2].value,
			text: findMyQuizzLevels.querySelectorAll(`.level-create-${i} .level-config input`)[3].value,
			minValue: Number(findMyQuizzLevels.querySelectorAll(`.level-create-${i} .level-config input`)[1].value)
		}
        levels.push(level);
    }
    console.log(levels);
    validateLevels(levels);

}

function validateLevels (levels) {

    let levelsOk = true;
    let menorValor = false;
    
    levels.forEach((elemento) => {

        if(elemento.title.length < 10) {
            console.log("problema titulo");
            levelsOk = false;
        }

        if (elemento.minValue < 0 || elemento.minValue > 100) {
            console.log("problema value");
            levelsOk = false;
        }else if (elemento.minValue === 0){
            menorValor = true;
        }

        if(elemento.text.length < 30) {
            console.log("problema descricao");
            levelsOk = false;

        }
        if(isValidHttpUrl(elemento.image) ===false) {
            console.log("problema imagem");
            levelsOk = false;
        }
    });

    if (menorValor && levelsOk) {

        GLOBAL.quizzFinished.levels = levels;
        console.log(GLOBAL.quizzFinished);
        upandoQuizzToServ();
        
    }else { alert("Problemas nos Campos")}
}

    GLOBAL.quizzFinished = {
	title: "Título do quizz",
	image: "https://http.cat/411.jpg",
	questions: [
		{
			title: "Título da pergunta 1",
			color: "#123456",
			answers: [
				{
					text: "Texto da resposta 1",
					image: "https://http.cat/411.jpg",
					isCorrectAnswer: true
				},
				{
					text: "Texto da resposta 2",
					image: "https://http.cat/412.jpg",
					isCorrectAnswer: false
				}
			]
		},
		{
			title: "Título da pergunta 2",
			color: "#123456",
			answers: [
				{
					text: "Texto da resposta 1",
					image: "https://http.cat/411.jpg",
					isCorrectAnswer: true
				},
				{
					text: "Texto da resposta 2",
					image: "https://http.cat/412.jpg",
					isCorrectAnswer: false
				}
			]
		},
		{
			title: "Título da pergunta 3",
			color: "#123456",
			answers: [
				{
					text: "Texto da resposta 1",
					image: "https://http.cat/411.jpg",
					isCorrectAnswer: true
				},
				{
					text: "Texto da resposta 2",
					image: "https://http.cat/412.jpg",
					isCorrectAnswer: false
				}
			]
		}
	],
	levels: [
		{
			title: "Título do nível 1",
			image: "https://http.cat/411.jpg",
			text: "Descrição do nível 1",
			minValue: 0
		},
		{
			title: "Título do nível 2",
			image: "https://http.cat/412.jpg",
			text: "Descrição do nível 2",
			minValue: 50
		}
	]
}

function upandoQuizzToServ () {
    toggleLoadingScreen();
    const promise = axios.post("https://mock-api.bootcamp.respondeai.com.br/api/v3/buzzquizz/quizzes", GLOBAL.quizzFinished);
    promise.then(savingmyQuizzId);
    promise.catch(() => {alert("Nao conseguimos enviar seu quizz, tente novamente mais tarde")});
    toggleLoadingScreen();
}

function savingmyQuizzId (quizzEnviado) {
    const meuQuizz = quizzEnviado.data;
    GLOBAL.usersQuizzesIds.push(meuQuizz.id);
    GLOBAL.serverQuizzes.push(meuQuizz);
    GLOBAL.myQuizzId = meuQuizz.id;
    GLOBAL.quizzRetornado = meuQuizz;
    storeUsersQuizzesLocally();

    quizzFinishedDisplay();

    myCardThirdScreen(GLOBAL.quizzRetornado);
    alert("Seu Quizz foi Salvo")
}
