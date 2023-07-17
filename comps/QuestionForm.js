import React from 'react';
import styles from './QuestionForm.module.css'
import { ErrorMessage } from '@hookform/error-message'

const QuestionForm = ({ handleSubmit, onSubmit, register, errors }) => {

  return (
    <section className={styles.form_container}>
      <form className={styles.question_form} onSubmit={handleSubmit((data) => onSubmit(data))}>
        <textarea id="question-input" type="text" className={styles.question_input} {...register("question")} placeholder="Question (Max characters: 1200)" maxLength="1200"></textarea>
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