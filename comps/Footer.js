import React from 'react';
import styles from './Footer.module.css'

const Footer = () => {
  return (
    <footer>

      <div className='footer_title'>g r a m m e r h u b</div>
      <div className='footer_info'>KEEP IN TOUCH</div>

      <div className='follow_us'>Follow us at:
        <box-icon type='logo' name='facebook'></box-icon>
        <box-icon type='logo' name='discord-alt'></box-icon>
        <box-icon name='linkedin' type='logo' ></box-icon>
      </div>

      <div className='acknowledgements'>
        <p>Built by: Zephyr, Steve, Andrea & Jake</p>
      </div>
    </footer>
  )
}

export default Footer