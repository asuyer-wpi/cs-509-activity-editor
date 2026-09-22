"use client"
import styles from "./page.module.css"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import { useEffect, useState } from "react"

import { ActivityEditor, Activity, Reporter } from "@/model"

export default function Page() {
  const [editor, setEditor] = useState(new ActivityEditor())

  /**
   * Controller: adds reporter to the reporter list
   * @param name - name of the reporter
   */
  function addReporter(name: string) {
    setEditor(editor.withNewReporter(new Reporter(name)))
  }

  // TODO: remove once 
  useEffect(() => {
    console.log("Activities:")
    for (const activity of editor.activities) {
      console.log(`${activity.name} - ${activity.description}`)
    }

    console.log("Reporters:")
    for (const reporter of editor.reporters) {
      console.log(`${reporter.name}`)
    }
  }, [editor])

  return (
    <main>
      <header>
        <h1 className={styles.pageTitle}>ActivityEditor</h1>
      </header>

      <section id="reporters">
        <h2 className={styles.sectionTitle}>Reporters</h2>
        <ReporterInput addReporter={addReporter} />
      </section>

      <section id="activities">
        <h2 className={styles.sectionTitle}>Activities</h2>
      </section>
    </main>
  )
}

/**
 * Input form for reporter attributes
 * @prop addReporter - callback function for adding a reporter
 */
function ReporterInput({ addReporter }: { addReporter: (name: string) => void }) {
  const reporterNameId = "reporter-name"

  function handleSubmit(event: React.SubmitEvent<HTMLFormElement>) {
    // Prevent page reload
    event.preventDefault();

    // Get name value from input field. Add the reporter if name is nonempty
    const name = document.getElementById(reporterNameId) as HTMLInputElement
    if (name.value !== "") {
      addReporter(name.value)

      // Clear field
      name.value = ""
    }
  }

  return (
    <form className={`${styles.nameAndAdd} ${styles.reporterInput}`} onSubmit={handleSubmit}>
      <label className={styles.nameLabel} htmlFor={reporterNameId}>
        Enter reporter name:
      </label>
      <input className={styles.nameInput} id={reporterNameId} type="text" />
      <button
        className={`${styles.iconButton} ${styles.addButton}`}
        type="submit" >
        <FontAwesomeIcon icon={faPlus} />
        Add
      </button>
    </form>
  )
}


