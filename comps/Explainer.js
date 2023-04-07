import React from 'react'
import styles from './Explainer.module.css'

const Explainer = () => {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Chatbox</h1>
      <p className={styles.info}>Give us a website and a question, we'll give you an answer!</p>
    </div>
  )
}

export default Explainer