
/** 
 * Makes a target div visible and hide all the others;
 * @param {String}  targetScreen the screen that should be displayed (first, second or third)
 */
 function switchScreen(targetScreen) {
    const idName = targetScreen + "-screen";
    document.querySelector(".visible").className = "hidden";
    document.querySelector(`#${idName}`).className = "visible";

    document.querySelector("html").scrollIntoView();
}

function toggleLoadingScreen() {
    const loadingScreen = document.querySelector("#loading-screen-container");

    loadingScreen.className === "hidden"
        ? loadingScreen.className = ""
        : loadingScreen.className = "hidden"
}

function generateQuizzCardHtml(quizz) {
    const {title, image, id} = quizz;
    console.log(title);
    console.log(quizz.title);
    const template = (
        `<div id="quizz-${id}"  class="quizz-banner" onclick="selectQuizz(this)"  style="background: linear-gradient(0deg, rgba(0,0,0,0.9) 0%, rgba(251,251,251,0) 60%), url(${image}) no-repeat; background-size: cover; background-repeat: no-repeat; background-position: center">
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
    const allQuestions = questions.map((question, index) => {
        const answerBoxes = generateQuizAnswerBoxesHtml(question.answers);
        const questionTemplate = (
            `<div class="question-container" id="question-${index}">
                <header class="question-header" style="background-color: ${question.color};">
                    <p>${question.title}</p>
                </header>
                <div class="answers-container" onclick="questionScrollManager(this)">
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
            ? document.querySelector(".user-quizzes-section .banners-container").insertAdjacentHTML("beforeend", quizzBanner)
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
    for(userQuizzInfo of GLOBAL.usersQuizzesInfo) {
        if(userQuizzInfo.id === quizzID) return true;
    }
    return false;
}


/** 
 * Check with there are any users quizzes registered, displaying the appropriate one
 */
function manageEmptyUsersQuizzInterface() {
    if(GLOBAL.usersQuizzesInfo.length === 0) {
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
    GLOBAL.runningQuizzInfo.answeredAmmount += 1;

    selectedAnswerElement.classList.contains("correct")
        ? GLOBAL.runningQuizzInfo.score += 1
        : void(0);

        
    colorizeAnswers(selectedAnswerElement.parentNode, selectedAnswerElement);

    GLOBAL.runningQuizzInfo.answeredAmmount === GLOBAL.runningQuizzInfo.quizz.questions.length
        ? displayEndingBanner()
        : void(0);
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

/** 
 * Decides if the aapp should scroll to the next question based on what's being displayed on screen
 * @param {Node} questionElement the question-container last answered
 */
function questionScrollManager(questionElement) {
    const questionNumber = Number(questionElement.parentNode.id.split("-")[1]);
    const nextElement = document.querySelector(`#question-${questionNumber + 1}`);
    setTimeout(() => {
        if(nextElement && nextElement.querySelector(".answer-box").onclick) { //Only scrolls if the next elements exists and are not selected yet
            nextElement.scrollIntoView()
        }
    }, 2000)    
}

function removeOnclickEvent(element) {
    element.onclick = "";
}


function displayEndingBanner() {
    const endingData = manufactureEndingQuizzData();
    const currentQuizzId = GLOBAL.runningQuizzInfo.quizz.id;

    const endingBannerTemplate = (
        `<div class="ending-banner-container">
            <header class="ending-banner-header"><p>${endingData.title}</p></header>
            <div class="ending-banner-main-content">
                <img src="${endingData.image}">
                <p>${endingData.text}</p>
            </div>
        </div>
        <button onclick="startQuizz(${currentQuizzId})">Reiniciar Quizz</button>
        <button id="home-link-button"  onclick="switchScreen('first')">Voltar pra home</button>`
    )

    document.querySelector(".quizz-container").innerHTML += endingBannerTemplate;

    setTimeout(() => {
        document.querySelector(".ending-banner-container").scrollIntoView();
    }, 2000)
}


/*Third-screen*/

/*Change to create-questions*/

function changeToCreateQuestions () {
    const basicInformationQuizz = savingBasicQuizzInformation();
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
        asksAboutQuizzDisplay();
        
        displayMyQuestionsBox(basicInformationQuizz.nQuestions)
    }else {alert("Preencha os campos com informacoes validas")}

}

function asksAboutQuizzDisplay() {

    document.querySelector("#asks-about-quizz-screen").classList.remove("hidden")
    document.querySelector("#basic-information-quizz-screen").className = "hidden";
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


function displayMyQuestionsBox (nQuestions) {
      const questionBoxLocal = document.querySelector("#asks-about-quizz-screen .questions-setup");
    for(let i=1; i<=nQuestions;i++) {
        questionBoxLocal.innerHTML += `<div class="pergunta-create-${i}">
        <div class="pergunta-box " onclick="perguntaConfigDisplay(this, ${i})">
            <h4>Pergunta ${i}</h4>
            <ion-icon name="create-outline"></ion-icon>
        </div>
        <div class="pergunta-config hidden">
            <div class="pergunta">
                <input type="text" placeholder="Titulo do Seu Quizz">
                <input type="text" placeholder="Cor de Fundo da Pergunta">
            </div>
            <div class="correct-answer">
                <h4>Resposta Correta</h4>
                <input type="text" placeholder="Resposta correta">
                <input type="text" placeholder="URL da imagem">
            </div>
            <div class="wrong-answers">
                <h4>Respostas incorretas</h4>
                <input type="text" placeholder="Resposta incorreta 1">
                <input type="text" placeholder="URL da imagem 1">
                <br>
                <br>
                <input type="text" placeholder="Resposta incorreta 2">
                <input type="text" placeholder="URL da imagem 2">
                <br>
                <br>
                <input type="text" placeholder="Resposta incorreta 3">
                <input type="text" placeholder="URL da imagem 3">
            </div>
        </div>
    </div>`
    }

}

function perguntaConfigDisplay (elemento, questionNumber) {
      document.querySelector(`.pergunta-create-${questionNumber} .pergunta-config`).classList.toggle("hidden");
      document.querySelector(`.pergunta-create-${questionNumber} .pergunta-config`).classList.toggle("showing");

}

function levelsScreenDisplay (questionsOk) {
    if (questionsOk ===true) {
        document.querySelector("#level-setup-screen").classList.remove("hidden")
        document.querySelector("#asks-about-quizz-screen").className = "hidden";
        levelsDisplay();
    }else{alert("Problemas nos campos")}

}

function levelsDisplay () {
    const basicInformationQuizz = savingBasicQuizzInformation();
    let levelQtd = basicInformationQuizz.nLevels;
    let LevelBoxLocal = document.querySelector("#level-setup-screen .levels-setup");
    LevelBoxLocal.innerHTML = '';

    for(let i=1; i<=levelQtd;i++) {
        LevelBoxLocal.innerHTML += `<div class="level-create-${i}">
        <div class="level-box" onclick="levelConfigDisplay(${i})">
            <h4>Nivel ${i}</h4>
            <ion-icon name="create-outline"></ion-icon>
        </div>
        <div class="level-config hidden">
            <input type="text" placeholder="Título do nível">
            <input type="text" placeholder="% de acerto mínima">
            <input type="text" placeholder="URL da imagem do nível">
            <input type="text" class="input-description" placeholder="Descrição do nível">
        </div>
    </div>`
    }
}
function levelConfigDisplay (levelNumber) {
    document.querySelector(`.level-create-${levelNumber} .level-config`).classList.toggle("hidden");
    document.querySelector(`.level-create-${levelNumber} .level-config`).classList.toggle("showing");
} 

function myCardThirdScreen (quizz) {
    const meuCard = generateQuizzCardHtml(quizz);
    document.querySelector(".meu-card").innerHTML = meuCard;
    console.log(quizz)
}


function quizzFinishedDisplay() {
    document.querySelector("#quizz-finished-screen").classList.remove("hidden")
    document.querySelector("#level-setup-screen").className = "hidden";
}

