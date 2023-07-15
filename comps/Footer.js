import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLinkedin } from '@fortawesome/free-brands-svg-icons'
import styles from './Footer.module.css'

const Footer = () => {
  return (
    <footer className={styles.acknowledgements}>

      {/* <div className='footer_info'>KEEP IN TOUCH</div>

      <div className='follow_us'>Follow us at:
        <box-icon type='logo' name='facebook'></box-icon>
        <box-icon type='logo' name='discord-alt'></box-icon>
        <box-icon name='linkedin' type='logo' ></box-icon>
      </div> */}

      <h3 className={styles.footer_head}>Built by</h3>
      <div className={styles.contact_list}>
        <section className={styles.contact}>
          <span className={styles.contact_name}>Steve</span>
          <a className={styles.contact_link} href="https://www.linkedin.com/in/stevesmodish/" target="_blank"><FontAwesomeIcon icon={faLinkedin} /></a>
        </section>
        <section className={styles.contact}>
          <span className={styles.contact_name}>Andrea</span>
          <a className={styles.contact_link} href="https://www.linkedin.com/in/andreaeverett/" target="_blank"><FontAwesomeIcon icon={faLinkedin} /></a>
        </section>
        <section className={styles.contact}>
          <span className={styles.contact_name}>Jake</span>
          <a className={styles.contact_link} href="https://www.linkedin.com/in/jake-m-hatfield/" target="_blank"><FontAwesomeIcon icon={faLinkedin} /></a>
        </section>
        <section className={styles.contact}>
          <span className={styles.contact_name}>Zephyr</span>
          <a className={styles.contact_link} href="https://www.linkedin.com/in/zephyrpfeiffer/" target="_blank"><FontAwesomeIcon icon={faLinkedin} /></a>
        </section>
      </div>
    </footer>
  )
}

export default Footer