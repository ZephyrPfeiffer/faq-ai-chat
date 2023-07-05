import React from 'react';
import styles from './QuestionForm.module.css'

const QuestionForm = ({ handleSubmit, onSubmit, register, errors }) => {

  return (
    <section className={styles.form_container}>
      <form className={styles.question_form} onSubmit={handleSubmit((data) => onSubmit(data))}>
        <input id="question-input" type="text" className={styles.question_input} {...register("question")} placeholder="Question"/>
        <ErrorMessage
          errors={errors}
          name="question"
          render={({ message }) => <p class={styles.question_error}>{message}</p>}
        />
        <input type="button" value="S u b m i t" className={styles.form_button} onClick={handleSubmit((data) => onSubmit(data))} />
      </form>
    </section>
  )
}

export default QuestionForm