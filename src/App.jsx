import { useState } from 'react'
import { FaBeer } from 'react-icons/fa';
import { FaRegSadCry } from "react-icons/fa";
import getTask from './words.js'
import clsx from 'clsx'


function App() {
  const[currentTask, setCurrentTask] = useState(null)
  const [guessedLetter, setGuessedLetter] = useState([])
  const [isWordRequeired, setWordRequired] = useState(false)

  /*BASIC ELEMENTS */

  const currentQuestion = currentTask? <p className='question' role='question'> {currentTask.question} </p> : ""
  const currentWord = currentTask? currentTask.answer.toUpperCase() : ""
  const currentWordArr = currentWord.split("")
  let isGameStarted = currentTask? true : false
  const lastGuessedLetter = guessedLetter[guessedLetter.length -1]

  const falseLetterArr = []
  
  guessedLetter.map(letter => {
      return (
        !currentWordArr.includes(letter) && falseLetterArr.push(letter)
      )
    
  })
  const numAttemptsLeft = 6 - falseLetterArr.length
  /* BOOLEANS*/
  
  const isWordLost = isGameStarted && falseLetterArr.length == 6
  const isGameOn = isGameStarted && !isWordLost
  const isGameWon = isGameStarted && currentWordArr.every(letter => guessedLetter.includes(letter))

  // KEYBOARD
  
  const keyBoard = 'abcdefghijklmnopqrstuvwxyz'.split('')

  const lettersElement = keyBoard.map((letter, index) =>{
    const isGuessed = guessedLetter.includes(letter.toUpperCase())
    const isLetCorrect = isGuessed && currentWordArr.includes(letter.toUpperCase())
    const isLetWrong = isGuessed && !currentWordArr.includes(letter.toUpperCase())

    const className = clsx({
      letters: true,
      correct: isLetCorrect,
      wrong: isLetWrong,
    })

    return(
      <button key={index} 
            className={className}
            disabled={isGameOn && !isGameWon? false : true}
            aria-disabled={guessedLetter.includes(letter)}
            aria-label={"Letter" + letter}
            onClick={()=> clickLetter(letter)}>
            {letter.toUpperCase()}
      </button>
    )
  })
 //

 //GAME MESSAGES

  const lostAttemptsMessage = <p role='status'> You don't have any attempts left!</p>
  const gameOverMessage = <p role='status'>Sorry, you have lost the game 
                              <span className='icons'><FaRegSadCry />
                              <FaRegSadCry className='icon'/>
                              <FaRegSadCry /></span>
                          </p>
                             
  const wonGameMessage = <p className='won-mess'>Congratulation! You have won!</p>                
  
  /* FUNCTIONS */
  function startGame(){
    setCurrentTask(getTask())
    setGuessedLetter([])
    setWordRequired(false)
  }
  
  function quitGame() {
    setCurrentTask(null)
    setGuessedLetter([])
    isGameStarted = false
  }

  function clickLetter(letter){
    setGuessedLetter(prevLetter => 
        prevLetter.includes(letter) ? prevLetter : [...prevLetter, letter.toUpperCase()]
    )
  }

  // Here to solve next: 
  function showWord(){
    setWordRequired(true)
  }

  //WORD

  const wordElement = currentWord.split("").map((letter, index) => {
    
    const isLetterGuessed = guessedLetter.includes(letter.toUpperCase())
    const isLetterCorrect = currentWordArr.includes(letter.toUpperCase())
    const showLetter = isLetterGuessed && isLetterCorrect ? letter : ""
    const showAllLetters = letter 

    const classWordElement = clsx({ 
      word: true,
      lostLetters: true
    })
    
    return(
        <span key={index} 
        className="word"
      > {showLetter }
      </span> 
    ) 

  })
  //

  const missedLettersElement = currentWord.split("").map((letter, index) => {
    const isLetterCorrect = currentWordArr.includes(letter.toUpperCase()) && guessedLetter.includes(letter.toUpperCase())
    const isLetterMissed = !guessedLetter.includes(letter)

    const classLetters = clsx({
      word: true,
      letterCorrect: isLetterCorrect,
      letterMissed: isLetterMissed
    })

    return(
      <span key={index} 
      className={classLetters}
    > {letter} 
    </span> 
  ) 
  })

  //ATTEMPTS SECTION
  const attemptsArr = [1,2,3,4,5,6]
  const attemptsElements = attemptsArr.map((item, index) => {

    const isAttemptLost = index < falseLetterArr.length

    const classAttempt = clsx({
      try:true,
      wrongAttempt: isAttemptLost
    })

    return(
      <div 
      className={classAttempt}
      key={index}
      > </div>
    )
  })

  const classAttemptsBox = clsx({
    attempts: true,
    attemptsLost: isWordLost,
  })
  //

  const classShowWordBtn = clsx({
    showWordBtn: true,
  })

  const classAttemptRule = clsx({
    attemptsRule: true,
    attemptRuleRem: isWordLost
  })

return (
    <div className='container'>

      <header> 
        <h1>Guess Word Game</h1>
      </header>

      <main> 

        <section className='rules-questions' aria-label='polite'>
            {isWordLost? "": <p> Answer the question and guess the word! </p>}
            {currentQuestion}
            {isWordLost && gameOverMessage}
        </section>

        {/* Questions and messages */}
        {isGameWon? wonGameMessage : 
          <section className='attempts-mess' aria-label='polite'>
            <p className={classAttemptRule}> {isWordLost? "" : "You have only six attempts"} </p>
            <div className={classAttemptsBox}> {isWordLost? lostAttemptsMessage: attemptsElements } </div>
          </section>}

        {/* Start game button */}
        {isGameStarted ? null : 
          <button className='start-game' onClick={startGame}> Start the Game </button>}

        {/* Word section */}
        {currentTask && !isWordRequeired? <section className='word-section'>{currentTask? wordElement : null}</section>:
          <section className='word-section'>{missedLettersElement}</section>
        }

        {/* Aria-region */}
        <section 
                className="sr-only" 
                aria-live="polite" 
                role="status"
            >
                 <p>
                    {currentWord.includes(lastGuessedLetter) ? 
                        `Correct! The letter ${lastGuessedLetter} is in the word.` : 
                        `Sorry, the letter ${lastGuessedLetter} is not in the word.`
                    }
                    You have {numAttemptsLeft} attempts left.
                </p>
                <p>Current word: {currentWord.split("").map(letter => 
                guessedLetter.includes(letter) ? letter + "." : "blank.")
                .join(" ")}</p>  
          </section>
        
        {/* Keyboard */}
        <section className='keyboard'>{lettersElement}</section>
        
        {/* Quit game and Start game buttons*/}
        {isGameStarted && !isWordLost && !isGameWon? <button 
                                      className='quit-game' 
                                      onClick={quitGame}> 
                                      Quit the Game </button> : 
        isWordLost ?
                        <div className='new-game-div'> 
                          <button 
                          className='new-game-btn'
                          onClick={startGame}> 
                          New Game 
                          </button>
                        
                          <button 
                              className={classShowWordBtn}
                              onClick={showWord}
                              >Show the word </button>
                        </div> : 
                        isGameWon?
                        <button 
                        className='new-game-btn'
                        onClick={startGame}> 
                        New Game 
                        </button> : null
                        }
  
      </main>
    </div>
      )
}

export default App
