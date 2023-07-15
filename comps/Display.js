import Card from './Card';
import styles from './Display.module.css';
import { useEffect, useRef } from 'react'

const Display = ({log, loading}) => {

  const bottomRef = useRef(null);

  const cardsList = log.map((value, index) => {
    return <Card key={index} question={value.question} answer={value.answer} loading={loading}/>
  })

  useEffect(() => {

    bottomRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' })

  }, [log])

  return (
    <section className={styles.display}>
      {cardsList}
      <div ref={bottomRef}></div>
    </section>
  )
}

export default Display;