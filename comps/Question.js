import styles from './Question.module.css'

const Question = ({question}) => {
  return (
    <div className='question-container'>
        <p className={styles.line}>Question: {question}</p>
    </div>
    
  )
}

export default Question;