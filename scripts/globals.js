const GLOBAL = {
    api: axios.create({
        baseURL: "https://mock-api.bootcamp.respondeai.com.br/api/v3/buzzquizz/quizzes"
    }),
    serverQuizzes: [], //this is an array of objects
    usersQuizzesIds: [], //this is an array of id strings
<<<<<<< HEAD
    runningQuizz: { // The quizz currently being played by the user
=======
    runningQuizzInfo: { // The quizz currently being played by the user
>>>>>>> e8a79c039693a9b171dfa98fdc598d368f794c34
        score: 0,
        quizz: {},
        answeredAmmount: 0,
    }
}
