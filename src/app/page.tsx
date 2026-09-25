"use client"
import styles from "./page.module.css"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faTrashCan, faUpDownLeftRight } from '@fortawesome/free-solid-svg-icons'
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

  /**
   * Controller: removes unassigned reporter from the reporter list
   * @param reporter - Reporter to remove
   */
  function removeReporter(reporter: Reporter) {
    setEditor(editor.withReporterRemoved(reporter))
  }

  /**
   * Controller: adds activity to the activies list
   * @param name - name of activity
   * @param description - description of activity
   */
  function addActivity(name: string, description: string) {
    setEditor(editor.withNewActivity(new Activity(name, description)))
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
        <h3 className={styles.listHeading}>Reporters:</h3>
        <ReporterList reporters={editor.getAvailableReporters()} removeReporter={removeReporter} />
      </section>

      <section id="activities">
        <h2 className={styles.sectionTitle}>Activities</h2>
        <ActivityInput addActivity={addActivity} />
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
      <input className={styles.textInput} id={reporterNameId} type="text" />
      <button
        className={`${styles.iconButton} ${styles.addButton}`}
        type="submit" >
        <FontAwesomeIcon icon={faPlus} />
        Add
      </button>
    </form>
  )
}

/**
 * List of reporters that can be independently deleted
 * @prop reporters - list of reporters to display
 * @prop removeReporter - callback function for removing a reporter
 */
function ReporterList({
  reporters, removeReporter
}: {
  reporters: Reporter[], removeReporter: (r: Reporter) => void
}) {
  const deleteButtonIdPrefix = "reporter-delete-"

  function handleDeleteClick(event: React.MouseEvent<HTMLButtonElement>) {
    // Get button that was clicked, then retrieve reporter index from it's id
    const button = event.currentTarget
    const idx = Number(button.id.split("-").at(-1))
    removeReporter(reporters[idx])
  }

  // Create list item entries for each reporter
  const reporterListItems = reporters.map((reporter, idx) =>
    <li className={styles.reporterItem} key={idx} draggable>
      <FontAwesomeIcon icon={faUpDownLeftRight} />
      {reporter.name}
      <button
        className={styles.iconButton}
        onClick={handleDeleteClick}
        id={deleteButtonIdPrefix + idx}>
        <FontAwesomeIcon icon={faTrashCan} />
      </button>
    </li>
  )

  return (
    <ul className={styles.reporterList}>
      {reporterListItems}
    </ul>
  )
}

/**
 * Input form for activity attributes
 * @prop addReporter - callback function for adding a activity
 */
function ActivityInput({
  addActivity
}: {
  addActivity: (name: string, description: string) => void
}) {
  const activityNameId = "activity-name"
  const activityDescriptionId = "activity-description"

  function handleSubmit(event: React.SubmitEvent<HTMLFormElement>) {
    // Prevent page reload
    event.preventDefault()

    // Get name and description values from input fields. Add the activity if both fields 
    // are nonempty
    const name = document.getElementById(activityNameId) as HTMLInputElement
    const description = document.getElementById(activityDescriptionId) as HTMLTextAreaElement
    if (name.value !== "" && description.value !== "") {
      addActivity(name.value, description.value)

      // Clear fields
      name.value = ""
      description.value = ""
    }
  }

  return (
    <form className={styles.activityInput} onSubmit={handleSubmit}>
      <span className={styles.nameAndAdd}>
        <label className={styles.activityNameLabel} htmlFor={activityNameId}>
          Enter activity name:
        </label>
        <input className={styles.textInput} id={activityNameId} type="text" />
        <button className={`${styles.iconButton} ${styles.addButton}`}>
          <FontAwesomeIcon icon={faPlus} />
          Add
        </button>
      </span>
      <label className={styles.activityDescriptionLabel} htmlFor={activityDescriptionId}>
        Enter activity description:
      </label>
      <textarea className={styles.textInput} id={activityDescriptionId}
        placeholder="Once you enter a name and description, press the + button"></textarea>
    </form>
  )
}

