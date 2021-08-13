const GLOBAL = {
    api: axios.create({
        baseURL: "https://mock-api.bootcamp.respondeai.com.br/api/v3/buzzquizz/quizzes"
    }),
    serverQuizzes: [], //this is an array of objects
    usersQuizzesIds: [], //this is an array of id strings
<<<<<<< HEAD
    runningQuizzInfo: { // The quizz currently being played by the user
=======
<<<<<<< HEAD
    score: 0
}
=======
    runningQuizz: { // The quizz currently being played by the user
>>>>>>> 43c371b7faa9e90d2e042ecb7604ec535d0a2cd4
        score: 0,
        quizz: {},
        answeredAmmount: 0,
    }
}
>>>>>>> cf91fa98a5e018f970996347deccddf7c7a3fb0d
