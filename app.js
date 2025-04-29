// app.js

let mode = '';
let score = 0;
let timer;
let timeLeft = 120;
let questions = [];
let currentQuestion = {};

function startGame(selectedMode) {
    mode = selectedMode;
    score = 0;
    timeLeft = 120;
    questions = [];

    document.getElementById('main-menu').style.display = 'none';
    document.getElementById('quiz').style.display = 'block';
    document.getElementById('review').style.display = 'none';
    document.getElementById('mode-title').innerText = mode.charAt(0).toUpperCase() + mode.slice(1);
    document.getElementById('score').innerText = 'Score: 0';

    generateQuestion();
    startTimer();
}

function startTimer() {
    document.getElementById('timer').innerText = `Time Left: ${timeLeft}`;
    timer = setInterval(() => {
        timeLeft--;
        document.getElementById('timer').innerText = `Time Left: ${timeLeft}`;
        if (timeLeft <= 0) {
            clearInterval(timer);
            endGame();
        }
    }, 1000);
}

function generateQuestion() {
    let num1, num2, operator;
    if (mode === 'addition') {
        num1 = Math.floor(Math.random() * 10);
        num2 = Math.floor(Math.random() * 10);
        operator = '+';
    } else if (mode === 'subtraction') {
        num1 = Math.floor(Math.random() * 20) + 1;
        num2 = Math.floor(Math.random() * (num1 + 1));
        while (num1 - num2 > 9 || num1 - num2 < 0) {
            num1 = Math.floor(Math.random() * 20) + 1;
            num2 = Math.floor(Math.random() * (num1 + 1));
        }
        operator = '-';
    } else if (mode === 'multiplication') {
        num1 = Math.floor(Math.random() * 13);
        num2 = Math.floor(Math.random() * 13);
        operator = '×';
    } else if (mode === 'division') {
        num2 = Math.floor(Math.random() * 12) + 1;
        let result = Math.floor(Math.random() * 13);
        num1 = num2 * result;
        operator = '÷';
    } else if (mode === 'mixed') {
        const operations = ['addition', 'subtraction', 'multiplication', 'division'];
        const randomMode = operations[Math.floor(Math.random() * operations.length)];
        mode = randomMode;
        generateQuestion();
        return;
    }

    currentQuestion = { num1, num2, operator };
    document.getElementById('question').innerText = `${num1} ${operator} ${num2} = ?`;
    document.getElementById('answer').value = '';
    document.getElementById('answer').focus();
}

function submitAnswer() {
    const userAnswer = Number(document.getElementById('answer').value);
    let correctAnswer;

    if (currentQuestion.operator === '+') correctAnswer = currentQuestion.num1 + currentQuestion.num2;
    if (currentQuestion.operator === '-') correctAnswer = currentQuestion.num1 - currentQuestion.num2;
    if (currentQuestion.operator === '×') correctAnswer = currentQuestion.num1 * currentQuestion.num2;
    if (currentQuestion.operator === '÷') correctAnswer = currentQuestion.num1 / currentQuestion.num2;

    questions.push({
        question: `${currentQuestion.num1} ${currentQuestion.operator} ${currentQuestion.num2}`,
        userAnswer,
        correctAnswer
    });

    if (userAnswer === correctAnswer) {
        score++;
        document.getElementById('score').innerText = `Score: ${score}`;
    }

    if (mode === 'mixed') {
        mode = 'mixed'; // Reset back to mixed after generating
    }

    generateQuestion();
}

document.getElementById('answer').addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        submitAnswer();
    }
});

function endGame() {
    document.getElementById('quiz').style.display = 'none';
    document.getElementById('review').style.display = 'block';

    document.getElementById('final-score').innerText = `Total Score: ${score}`;

    const questionList = document.getElementById('question-list');
    questionList.innerHTML = '';

    questions.forEach(q => {
        const div = document.createElement('div');
        if (q.userAnswer === q.correctAnswer) {
            div.innerHTML = `<span class='correct'>${q.question} = ${q.userAnswer} ✅</span>`;
        } else {
            div.innerHTML = `<span class='incorrect'>${q.question} = ${q.userAnswer} ❌ (Correct: ${q.correctAnswer})</span>`;
        }
        questionList.appendChild(div);
    });
}

function restartSameMode() {
    startGame(mode);
}

function goToMainMenu() {
    document.getElementById('main-menu').style.display = 'block';
    document.getElementById('quiz').style.display = 'none';
    document.getElementById('review').style.display = 'none';
}
