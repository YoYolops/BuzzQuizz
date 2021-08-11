void async function startApp() {
    console.log("oi")
    await getServerQuizzes();
    displayQuizzes();
}()