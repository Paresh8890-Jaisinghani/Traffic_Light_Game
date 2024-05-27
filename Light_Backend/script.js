const redLight = document.getElementById('red');
const yellowLight = document.getElementById('yellow');
const greenLight = document.getElementById('green');
const startBtn = document.getElementById('start-btn');
const click = document.getElementById('Click');
const container = document.getElementById('container');
const res1 = document.getElementById('res1');
const res2 = document.getElementById('res2');
const res3 = document.getElementById('res3');
const res4 = document.getElementById('res4');
const result = document.getElementById('result');
const next = document.getElementById('next');
const audio1 = new Audio('sound1.mp3');
const audio2 = new Audio('sound2.mp3');
const loginform = document.getElementById("loginform");
const number = document.getElementById("otp");
const mainMenu = document.getElementById("main_Menu");
const sec = document.querySelector(".sec");


next.style.display = 'none';
result.style.display = 'none';
click.style.display = 'none';
let intervalId;
let roundCount = 0;
let round = 0;
let score = 0;
let currentRound = 0;
let totalScore = 0;
let roundScores = []; // Array to store scores for each round

let otp;

loginform.addEventListener("submit", async function(ev){
    ev.preventDefault();
    const temp = number.value;
    otp = temp.toString();
    console.log(otp);

    try{
        const response = await fetch('http://localhost:3006/api/scores',{
            method : 'POST',
            headers :{
                'Content-Type' : 'application/json'
            },
            body : JSON.stringify({
                TrafficLightScore1 : 0,
                TrafficLightScore2 : 0,
                TrafficLightScore3 : 0,
                otpcode : otp
            })
        });

        if (response.status === 404) {
            alert("Wrong code Entered, Please try again.");
            location.reload();
            return;
        }

        sec.style.display = "none";
        mainMenu.style.display = "flex";
        alert("You are logged in successfully.");
    } catch (err) {
        console.error('Error logging in:', err.message);
        alert("An error occurred. Please try again.");
    }
  });

  async function getotpFromUser() {
    return otp;
  }




const startGame = () => {
    startBtn.style.display = 'none';
    click.style.display = 'block';
    intervalId = setInterval(changeLight, 800);
    setTimeout(endGame, 15000);
    // setTimeout(endGame, 1); // change karna hai
    currentRound++;
    updateStartButton();
};

let previousLight = '';

const changeLight = () => {
    const lights = ['red', 'yellow', 'green'];
    let randomIndex = Math.floor(Math.random() * lights.length);

    while (lights[randomIndex] === 'green' && lights[randomIndex] === previousLight) {
        randomIndex = Math.floor(Math.random() * lights.length);
    }

    const randomLight = lights[randomIndex];
    previousLight = randomLight;

    if (randomLight === 'red') {
        redLight.style.backgroundColor = 'red';
        yellowLight.style.backgroundColor = 'black';
        greenLight.style.backgroundColor = 'black';
    } else if (randomLight === 'yellow') {
        redLight.style.backgroundColor = 'black';
        yellowLight.style.backgroundColor = 'yellow';
        greenLight.style.backgroundColor = 'black';
    } else {
        roundCount++;
        redLight.style.backgroundColor = 'black';
        yellowLight.style.backgroundColor = 'black';
        greenLight.style.backgroundColor = 'green';
    }

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('click', handleKeyDown);
};

const press = () => {
    if (greenLight.style.backgroundColor === 'green') {
        audio2.play()
        score++;
    }

    if ((redLight.style.backgroundColor === 'red' || yellowLight.style.backgroundColor === 'yellow')) {
        audio1.play();
    }

    else if (greenLight.style.backgroundColor === 'black') {
        score--;
    }
    document.removeEventListener('keydown', handleKeyDown);
}

const handleKeyDown = (event) => {
    if ((event.key === ' ') && greenLight.style.backgroundColor === 'green') {
        audio2.play()
        score++;
    }

    if ((event.key === ' ') && (redLight.style.backgroundColor === 'red' || yellowLight.style.backgroundColor === 'yellow')) {
        audio1.play();
    }

    else if ((event.key === ' ') && greenLight.style.backgroundColor === 'black') {
        score--;
    }
    document.removeEventListener('keydown', handleKeyDown);
};



const endGame = async () => {
    clearInterval(intervalId);
    round += roundCount;
    totalScore += score;
    roundScores.push(`${score}/${roundCount}`); // Push score in the desired format
    if (currentRound === 3) {
        const averageScore = (totalScore * 100) / round;
        startBtn.style.display = 'none';
        next.style.display = 'initial';
        // Display scores for each round
        // for (let i = 0; i < roundScores.length; i++) {
        //     alert(`Round ${i + 1} Score: ${roundScores[i]}`);
        // }
        res1.innerHTML = `Round 1 Score: ${roundScores[0]}`;
        res2.innerHTML = `Round 2 Score: ${roundScores[1]}`;
        res3.innerHTML = `Round 3 Score: ${roundScores[2]}`;
        res4.innerHTML = `Final Score: ${averageScore.toFixed(2)}`;
        result.style.display = 'block';
        container.style.display = 'none';
        // alert( `Final Score: ${averageScore.toFixed(2)}`);

        totalScore = 0; // Reset totalScore for the next game
        currentRound = 0;
        roundCount = 0;
        roundScores = []; // Reset roundScores for the next game


        try {
            const otp = await getotpFromUser();
            const response = await fetch('http://localhost:3006/api/scores', {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },

                body: JSON.stringify({
                    TrafficLightScore1: `${roundScores[0]}`,
                    TrafficLightScore2: `${roundScores[1]}`,
                    TrafficLightScore3: `${roundScores[2]}`,
                    otpcode: otp
                })
            });


            console.log('Score saved successfully');
        } catch (err) {
            console.error('Error saving score:', err.message);
        }


    } else {
        startBtn.style.display = 'block';
        click.style.display = 'none';
        // startBtn.innerText = `Start Again (Score: ${score}/${roundCount})`;
        roundCount = 0;
    }





    score = 0;
    intervalId = null;
};

// const updateStartButton = () => {
//     if (currentRound === 3) {
//         startBtn.innerText = 'Start Trial Round';
//     } else if (currentRound <= 3) {
//         startBtn.innerText = `Start Round ${currentRound}`;
//     }
// };

startBtn.addEventListener('click', startGame);