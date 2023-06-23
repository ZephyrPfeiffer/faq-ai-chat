import React from 'react';
import styles from './WebsiteForm.module.css'

const Form = ({ handleSubmit, onSubmit, register, errors }) => {

  let errorDisplay = (errors.website?.message ? <span className={styles.website_error}>{errors.website?.message}</span> : null)

  return (
    <section className={styles.form_container}>
      <form className={styles.website_form} onSubmit={handleSubmit((data) => onSubmit(data))}>
        <input id="website-input" className={styles.website_input} {...register("website")} type="text" placeholder="Website URL" />
        {errorDisplay}
      </form>
    </section>
  )
}

export default Form