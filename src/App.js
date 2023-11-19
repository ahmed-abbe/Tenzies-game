import { useState, useEffect } from "react";
import Confetti from "react-confetti";
import Die from "./components/Die";

const App = () => {
    const [dice, setDice] = useState(() => allNewDice());
    const [tenzies, setTenzies] = useState(false);
    const [roll, setRoll] = useState(0);
    const [time, setTime] = useState(0);
    const [counter, setCounter] = useState(0);

    // variabel to clear setInterval

    // Function to change isHeld value on click
    function holdDice(id) {
        setDice((prevDice) =>
            prevDice.map((die) =>
                die.id === id ? { ...die, isHeld: !die.isHeld } : die
            )
        );
        if (!counter) {
            setCounter(updateTime(setTime));
        }
    }

    useEffect(() => {
        // Get highscore from local storage
        let highscore = JSON.parse(localStorage.getItem("highscore"));
        let bestTimeElement = document.querySelector(".game .highscore span");

        // check if highscore exist
        if (highscore) {
            bestTimeElement.textContent = `
            best time: ${formatTime(highscore.seconds)} `;
        } else {
            bestTimeElement.textContent = "No highscore";
        }

        if (tenzies) {
            // when tenzies is true set back all state to default
            changeState(setTenzies);

            setRoll(0);

            setTime(0);

            setCounter(0);
        } else if (
            dice.every(function (die) {
                return die.isHeld && die.value === this;
            }, dice[0].value)
        ) {
            // if all dice has the same value update the state
            changeState(setTenzies);

            updateScore(time, highscore);

            clearInterval(counter);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dice]);

    // create all dice elements
    let diceElements = dice.map((die) => (
        <Die
            key={die.id}
            value={die.value}
            isHeld={die.isHeld}
            handleClick={() => holdDice(die.id, die.value)}
        />
    ));

    return (
        <main>
            <section className="game">
                <div className="info">
                    <h1>Tenzies</h1>
                    <p>
                        Roll until all dice are the same. Click each die to
                        freeze it at its current value between rolls.
                    </p>
                </div>
                <div className="detail">
                    <div className="highscore">
                        <i className="fa-solid fa-trophy"></i>
                        <span></span>
                    </div>
                    <div className="current">
                        <span className="roll">roll: {roll}</span>
                        <span className="time">Time: {formatTime(time)}</span>
                    </div>
                </div>
                <div className="container">{diceElements}</div>
                {tenzies ? (
                    <>
                        <button
                            className="new-game-btn"
                            onClick={() => {
                                setDice(allNewDice());
                            }}
                        >
                            New Game
                        </button>
                        <Confetti />
                    </>
                ) : (
                    <button
                        className="roll-btn"
                        onClick={() => {
                            setDice((prevDice) => allNewDice(prevDice));
                            setRoll((prev) => ++prev);
                        }}
                    >
                        Roll
                    </button>
                )}
            </section>
        </main>
    );
};

export default App;

// Function to Create New Dies
function allNewDice(dice) {
    let arr = [];
    if (dice) {
        arr = dice.map((die) =>
            die.isHeld ? die : { ...die, value: randomNumber() }
        );
    } else {
        for (let i = 0; i < 10; i++) {
            arr.push({
                value: randomNumber(),
                isHeld: false,
                id: i + 1,
            });
        }
    }
    return arr;
}

// Function to get random number between 1 and 6
function randomNumber() {
    return Math.ceil(Math.random() * 6);
}

// Function to toggle unactive class at .game element
function changeState(setTenzies) {
    setTenzies((prev) => !prev);
    document.querySelector(".game .container").classList.toggle("unactive");
}

// Function to update highscore
function updateScore(time, highscore) {
    let seconds = time;

    let current = {
        seconds: seconds,
    };

    if (highscore) {
        if (current.seconds < highscore.seconds) {
            localStorage.setItem("highscore", JSON.stringify(current));
        }
    } else {
        localStorage.setItem("highscore", JSON.stringify(current));
    }
}

// Function to update time every second
function updateTime(setTime) {
    let counter = setInterval(() => {
        setTime((seconds) => ++seconds);
    }, 1000);
    return counter;
}

// Function to format time into a string
function formatTime(time) {
    return `${Math.trunc(time / 60)
        .toString()
        .padStart(2, "0")}:${Math.trunc(time % 60)
        .toString()
        .padStart(2, "0")}`;
}
