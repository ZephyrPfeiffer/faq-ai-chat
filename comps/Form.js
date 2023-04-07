import React from 'react';
import styles from './Form.module.css'

const Form = ({ handleSubmit, onSubmit, register, errors }) => {
  return (
    <section className={styles.form_container}>
      <form className={styles.question_form} onSubmit={handleSubmit((data) => onSubmit(data))}>
        <label htmlFor="website-input">Website:</label>
        <input id="website-input" className={styles.question_input} {...register("website")} type="text" />
        <span>{errors.website?.message}</span><br />
        <label htmlFor="question-input">Question:</label>
        <input id="question-input" className={styles.question_input} {...register("question")} type="text" />
        <span>{errors.question?.message}</span><br />
        <input type="button" value="S u b m i t" className={styles.form_button} onClick={handleSubmit((data) => onSubmit(data))} />
      </form>
    </section>
  )
}

export default Form