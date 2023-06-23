import Card from './Card';
import styles from './Display.module.css';

const Display = ({log, loading}) => {
  const cardsList = log.map((value, index) => {
    return <Card key={index} question={value.question} answer={value.answer} loading={loading}/>
  })
  return (
    <section className={styles.display}>
      {cardsList}
    </section>
  )
}

export default Display;