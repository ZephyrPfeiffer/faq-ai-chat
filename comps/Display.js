import Card from './Card';
import QuestionForm from './QuestionForm';
import styles from './Display.module.css';

const Display = ({log, loading, handleSubmit, onSubmit, register, errors}) => {
  const cardsList = log.map((value, index) => {
    return <Card key={index} question={value.question} answer={value.answer} loading={loading}/>
  })
  return (
    <section className={styles.display}>
      {cardsList}
      <QuestionForm 
        handleSubmit={handleSubmit} 
        register={register} 
        errors={errors} 
        onSubmit={onSubmit}
      />
    </section>
  )
}

export default Display;