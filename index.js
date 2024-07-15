import express from 'express';
import bodyParser from 'body-parser';
import pg from 'pg';
import e from 'express';

const db = new pg.Client({
    user : 'postgres',
    host : 'localhost',
    database : 'world',
    password : '12345',
    port : 5432
});

db.connect();

const server = express();
const _PORT = 3000;

var quiz = [];
let score = 0;
let currentQuestion;

db.query("SELECT * FROM capitals", (err, res) => {
    if(err) {
        console.error('Error: ' + err.message);
    } else {
        quiz = res.rows;
    }
});

server.use(bodyParser.urlencoded({extended : true}));
server.use(express.static('public'));

server.get('/', async(req, res) => {
    await nextQuestion();

    res.render('index.ejs', {
        score : score,
        question : currentQuestion
    });
})

server.post('/', (req, res) => {
    console.log(req.body);
    const answer = req.body.capital.trim();
    let isCorrect = "true";

    if(currentQuestion.capital.toLowerCase() === answer.toLowerCase()) {
        score++;
        nextQuestion();
        isCorrect = "true";
    } else {
        score = 0;
        nextQuestion();
        isCorrect = "false";
    }

    res.render('index.ejs', {
        score : score,
        question : currentQuestion,
        isCorrect : isCorrect
    });
})

server.listen(_PORT, () => {
    console.log(`Listening to port: ${_PORT}`);
})

async function nextQuestion() {
    const randomCountry = quiz[Math.floor(Math.random() * quiz.length)];
    currentQuestion = randomCountry;
}