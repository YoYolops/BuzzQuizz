void async function startApp() {
    toggleLoadingScreen();
    loadLocallyStoragedQuizzes();
    await getServerQuizzes();
    displayQuizzes();

    setTimeout(() => { /* só pra tela de loading durar mais tempo na tela */
        toggleLoadingScreen();
    }, 2000)
    console.log(GLOBAL.usersQuizzesInfo)
}();

function refreshApp() {
    history.go();
}

function selectQuizz(elementWhoCalled) {
    const quizzID = elementWhoCalled.id.split("-")[1];
    startQuizz(quizzID);
}


function startQuizz(quizzID) {
    const quizz = searchQuizzById(quizzID);
    resetGlobalRunnigQuizzInfo({
        score: 0,
        quizz: quizz,
        answeredAmmount: 0,
    });

    resetScreenInterface("#second-screen > .quizz-container");

    switchScreen("second");
    displayQuizzQuestions(quizz);

    document.querySelector(".main-banner").id = `quizz-${quizzID}`;
    document.querySelector(".main-banner").style = `background: linear-gradient(0deg, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.6) 100%), url(${quizz.image}) no-repeat; background-size: cover; background-repeat: no-repeat; background-position: center`;
    document.querySelector(".main-banner-title").textContent = quizz.title;
}