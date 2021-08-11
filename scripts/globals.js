const GLOBAL = {
    api: axios.create({
        baseURL: "https://mock-api.bootcamp.respondeai.com.br/api/v3/buzzquizz/quizzes"
    }),
    serverQuizzes: [], //this is an array of objects
    usersQuizzesIds: [], //this is an array os id strings
}