import React from 'react';
import styles from './WebsiteForm.module.css'

const Form = ({ handleSubmit, onSubmit, register, errors }) => {
  return (
    <section className={styles.form_container}>
      <form className={styles.question_form} onSubmit={handleSubmit((data) => onSubmit(data))}>
        <input id="website-input" className={styles.question_input} {...register("website")} type="text" placeholder="Website URL" />
        <span>{errors.website?.message}</span><br />
      </form>
    </section>
  )
}

export default Form