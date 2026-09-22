"use client"
import styles from "./page.module.css"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'

export default function Page() {
  return (
    <main>
      <header>
        <h1 className={styles.pageTitle}>ActivityEditor</h1>
      </header>

      <section id="reporters">
        <h2 className={styles.sectionTitle}>Reporters</h2>
        <ReporterInput />
      </section>

      <section id="activities">
        <h2 className={styles.sectionTitle}>Activities</h2>
      </section>
    </main>
  )
}


function ReporterInput() {
  function handleAddReporter() {
    // TODO
  }

  return (
    <span className={`${styles.nameAndAdd} ${styles.reporterInput}`}>
      <label className={styles.nameLabel} htmlFor="reporter-name">
        Enter reporter name:</label>
      <input className={styles.nameInput} id="reporter-name" type="text" />
      <button
        className={`${styles.iconButton} ${styles.addButton}`}
        onClick={handleAddReporter} >
        <FontAwesomeIcon icon={faPlus} />
        Add
      </button>
    </span>

  )
}


