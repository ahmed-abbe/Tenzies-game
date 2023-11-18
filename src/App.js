import { useState, useEffect } from "react";
import Confetti from "react-confetti";
import Die from "./components/Die";

const App = () => {
    const [dice, setDice] = useState(() => allNewDice());
    const [tenzies, setTenzies] = useState(false);
    const [roll, setRoll] = useState(0);
    const [time, setTime] = useState(() => Date.now());

    // Function to change isHeld value on click
    function holdDice(id) {
        setDice((prevDice) =>
            prevDice.map((die) =>
                die.id === id ? { ...die, isHeld: !die.isHeld } : die
            )
        );
    }

    useEffect(() => {
        let highscore = JSON.parse(localStorage.getItem("highscore"));
        let highscoreElement = document.querySelector(
            ".game .highscore div:first-of-type"
        );

        let rollElement = document.querySelector(
            ".game .highscore div:last-of-type"
        );

        if (highscore) {
            highscoreElement.textContent = `
            best time: ${highscore.mins.toString().padStart(2, "0")}:${(
                highscore.seconds % 60
            )
                .toString()
                .padStart(2, "0")} `;
        } else {
            highscoreElement.textContent = "No highscore";
        }

        rollElement.textContent = `roll: ${roll}`;

        if (tenzies) {
            changeState(setTenzies);

            setRoll(0);

            setTime(Date.now());

            rollElement.textContent = `roll: 0`;
        } else if (
            dice.every(function (die) {
                return die.isHeld && die.value === this;
            }, dice[0].value)
        ) {
            changeState(setTenzies);

            updateScore(Date.now() - time, highscore);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dice]);

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
                <div className="highscore">
                    <div></div>
                    <div></div>
                </div>
                <div className="info">
                    <h1>Tenzies</h1>
                    <p>
                        Roll until all dice are the same. Click each die to
                        freeze it at its current value between rolls.
                    </p>
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
function updateScore(time, highscore) {
    let seconds = Math.round(time / 1000);
    let mins = Math.round(seconds / 60);
    let current = {
        mins: mins,
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
