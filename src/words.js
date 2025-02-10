
const wordsArr  = [
    {question: "What is the capital city of Scotland? ",
     answer: "Edinburgh"
    },
    {question: "What is the name of the world’s highest mountain?",
     answer: "Everest"
    },
    {question: "What is the name of the fairy in Peter Pan?",
        answer: "Tinkerbell"
    }
]
function getTask(){
    let randomIndex = Math.floor(Math.random() * wordsArr.length)
    return wordsArr[randomIndex ]
}
getTask()


export default getTask