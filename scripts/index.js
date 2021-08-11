void async function startApp() {
    console.log("oi")
    await getServerQuizzes();
    displayQuizzes();
}();


function startQuizz(elementWhoCalled) {
    const quizzID = elementWhoCalled.id.split("-")[1];
    const quizz = searchQuizzById(quizzID);
    switchScreen("second");
    displayQuizzQuestions(quizz);
    document.querySelector(".main-banner").style.backgroundImage = `url('${quizz.image}')`;
}