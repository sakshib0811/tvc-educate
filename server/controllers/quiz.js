const mongoose = require("mongoose");
const { validationResult } = require("express-validator");
const HttpError = require("../models/http-error");
const Quizzes = require("../models/quiz");

const createQuiz = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return HttpError("Invalid arguments passed, please try again!", 422);
  }
  try {
    const { question, option1, option2, option3, option4, questionSubject, correctAnswer } =
      req.body;
    const createdQuestion = await Quiz.create({
      question,
      option1,
      option2,
      option3,
      option4,
      questionSubject,
      correctAnswer,
    });
  } catch (err) {
    console.log(err);
  }
};

const getAllQuestions = async (req, res, next) => {
    let quizQuestions;
    // const findCollection = () => {
    //   const collections = mongoose.connection.collections;
    //   let collectionFound = false;
    
    //   for (let collection in collections) {
    //     console.log(collection);
    //   }
    
    //   //return collectionFound;
    // };
    // findCollection();
    try {
        quizQuestions = await Quizzes.find();
        // res.send(quizQuestions);
        // res.json ({quiz: quizQuestions.map((post) => post.toObject({ getters: true }))});
    } catch (err) {
      return next(new HttpError('Could not find any quiz questions, please try again or contact administrator', 500));
    }
    res.json ({quiz: quizQuestions.map((post) => post.toObject({ getters: true }))});
};


const removeQuestion = async (req, res, next) => {
  let { questionId } = req.params;
  let question;
  try {
    question = await Quiz.findById(questionId);
  } catch(err) {
    return next(new HttpError('Question cannot be deleted', 500));
  }
}; // since we are just finding a question in this method, we can use it to find a question by Id as well.


const getQuestionById = async (req, res, next) => {
  let { questionId } = req.params;
  let question;
  try {
    question = await Quiz.findById(questionId);
  } catch(err) {
    return next(new HttpError('Cannot find the specified question', 500));
  }
  res.json(question);
}

exports.getAllQuestions = getAllQuestions;
exports.removeQuestion = removeQuestion;
exports.createQuiz = createQuiz;
exports.getQuestionById = getQuestionById;