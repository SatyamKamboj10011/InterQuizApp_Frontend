import axios from "axios";
const BASE_URL = "http://localhost:8080/quiz";

export const getAllQuizzes = () => axios.get(`${BASE_URL}/all`);
export const createQuiz = (quizData) => axios.post(`${BASE_URL}/generateQuestions`, quizData);
export const deleteQuiz = (id) => axios.delete(`${BASE_URL}/${id}`);
export const getQuizById = (id) => axios.get(`${BASE_URL}/${id}`);
