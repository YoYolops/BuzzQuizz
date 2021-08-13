const GLOBAL = {
    api: axios.create({
        baseURL: "https://mock-api.bootcamp.respondeai.com.br/api/v3/buzzquizz/quizzes"
    }),
    serverQuizzes: [], //this is an array of objects
    usersQuizzesIds: [], //this is an array of id strings
<<<<<<< HEAD
    score: 0
}
=======
    runningQuizz: { // The quizz currently being played by the user
        score: 0,
    }
}
>>>>>>> cf91fa98a5e018f970996347deccddf7c7a3fb0d
