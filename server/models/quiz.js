const mongoose = require("mongoose");

//schema = blueprint of post (it must contain title, image, etc.)
const Schema = mongoose.Schema;

//model - based on schema - each instance is a new document
const quizSchema = new Schema({
  question: {
    type: String,
    required: true,
  },
  option1: { type: String, },
  option2: { type: String, }, 
  option3: { type: String, },
  option4: { type: String, },
  questionSubject: { type: String, },
  correctAnswer: { type: String, }
}, {
  collection: 'quiz'
});

module.exports = mongoose.model('Quizzes', quizSchema); //returns a constructor function
