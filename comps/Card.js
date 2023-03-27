import Question from '/comps/Question';
import Answer from '/comps/Answer';
import styles from './Card.module.css';
import { ThreeDots} from  'react-loader-spinner'

const Card = ({question, answer, loading}) => {
  return (<div className={styles.card}>
    <Question question={question}/>
    {loading && answer === '' ? <ThreeDots />: <Answer answer={answer}/> }
  </div>)
}

export default Card;