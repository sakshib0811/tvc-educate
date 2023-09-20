const express = require('express');
const { check } = require('express-validator');

const quizController = require('../controllers/quiz');

const router = express.Router();

const {
    getAllQuestions,
    removeQuestion,
    createQuiz, 
    getQuestionById
} = quizController;

router.get("/", getAllQuestions);

router.get("/question/:quizId", getQuestionById);

router.delete("/question/:quizId", removeQuestion);

router.post("/question", createQuiz);

module.exports = router;