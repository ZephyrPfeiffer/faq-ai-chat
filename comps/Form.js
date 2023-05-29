import React from 'react';
import styles from './Form.module.css'

const Form = ({ handleSubmit, onSubmit, register, errors }) => {
  return (
    <section className={styles.form_container}>
      <form className={styles.question_form} onSubmit={handleSubmit((data) => onSubmit(data))}>
        <input id="website-input" className={styles.question_input} {...register("website")} type="text" placeholder="Website URL" />
        <span>{errors.website?.message}</span><br />
        <input id="question-input" className={styles.question_input} {...register("question")} type="text" placeholder="Question" />
        <span>{errors.question?.message}</span><br />
        <input type="button" value="S u b m i t" className={styles.form_button} onClick={handleSubmit((data) => onSubmit(data))} />
      </form>
    </section>
  )
}

export default Form