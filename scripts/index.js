void async function startApp() {
    console.log("oi")
    await getServerQuizzes();
    displayQuizzes();
}();


function startQuizz(elementWhoCalled) {
    const quizzID = elementWhoCalled.id.split("-")[1];
    const quizz = searchQuizzById(quizzID);
    
    GLOBAL.runningQuizzInfo.score = 0;
    GLOBAL.runningQuizzInfo.quizz = quizz;

    switchScreen("second");
    displayQuizzQuestions(quizz);

    document.querySelector(".main-banner").id = `quizz-${quizzID}`;
    document.querySelector(".main-banner").style = `background: linear-gradient(0deg, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.6) 100%), url(${quizz.image}) no-repeat; background-size: cover; background-repeat: no-repeat; background-position: center`;
    document.querySelector(".main-banner-title").textContent = quizz.title;
}