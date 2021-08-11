
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