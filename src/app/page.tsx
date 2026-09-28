"use client"
import styles from "./page.module.css"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faPlus, faTrashCan, faUpDownLeftRight } from "@fortawesome/free-solid-svg-icons"
import { useState } from "react"

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

  /**
   * Controller: removes unassigned activity from the activity list
   * @param activity - Activity to remove
   */
  function removeActivity(activity: Activity) {
    setEditor(editor.withActivityRemoved(activity))
  }

  /**
   * Controller: moves an activity to the front of the activity list
   * @param activity - Activity to promote
   */
  function promoteActivity(activity: Activity) {
    setEditor(editor.withActivityPromoted(activity))
  }

  /**
   * Controller: assignes `activity` to `reporter`
   * @param activity - activity to assign
   * @param reporter - reporter to assign activity to
   */
  function assignReporter(activity: Activity, reporter: Reporter) {
    setEditor(editor.withActivityAssigned(activity, reporter))
  }

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
        <h3 className={styles.listHeading}>Activities (click one to promote):</h3>
        <ActivityList
          activities={editor.activities}
          availableReporters={editor.getAvailableReporters()}
          removeActivity={removeActivity}
          assignReporter={assignReporter}
          promoteActivity={promoteActivity} />
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

  const [reporterName, setReporterName] = useState("")
  const canSubmit = (reporterName !== "")

  function handleSubmit(event: React.SubmitEvent<HTMLFormElement>) {
    // Prevent page reload
    event.preventDefault();

    // Get name value from input field. Add the reporter if name is nonempty
    const name = document.getElementById(reporterNameId) as HTMLInputElement
    if (name.value !== "") {
      addReporter(name.value)

      // Clear field
      name.value = ""
      setReporterName("")
    }
  }

  return (
    <form className={`${styles.nameAndAdd} ${styles.reporterInput}`} onSubmit={handleSubmit} autoComplete="off">
      <label className={styles.nameLabel} htmlFor={reporterNameId}>
        Enter reporter name:
      </label>
      <input
        type="text"
        className={styles.textInput}
        id={reporterNameId}
        onChange={event => setReporterName(event.target.value)} />
      <button
        className={`${styles.iconButton} ${styles.addButton}`}
        type="submit"
        disabled={!canSubmit}
        title={canSubmit ? "" : "Enter reporter name first"}>
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
    <li className={styles.reporterItem} key={idx}>
      <button
        className={styles.iconButton}
        onClick={handleDeleteClick}
        id={deleteButtonIdPrefix + idx}>
        <FontAwesomeIcon icon={faTrashCan} />
      </button>
      {reporter.name}
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

  const [activityName, setActivityName] = useState("")
  const [activityDescription, setActivityDescription] = useState("")
  const canSubmit = activityName !== "" && activityDescription !== ""

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
      setActivityName("")
      setActivityDescription("")
    }
  }

  return (
    <form className={styles.activityInput} onSubmit={handleSubmit} autoComplete="off">
      <span className={styles.nameAndAdd}>
        <label className={styles.activityNameLabel} htmlFor={activityNameId}>
          Enter activity name:
        </label>
        <input
          type="text"
          className={styles.textInput}
          id={activityNameId}
          onChange={event => setActivityName(event.target.value)} />
        <button
          className={`${styles.iconButton} ${styles.addButton}`}
          disabled={!canSubmit} 
          title={canSubmit ? "" : "Enter activity name and descripiton first"} >
          <FontAwesomeIcon icon={faPlus} />
          Add
        </button>
      </span>
      <label className={styles.activityDescriptionLabel} htmlFor={activityDescriptionId}>
        Enter activity description:
      </label>
      <textarea
        className={styles.textInput}
        id={activityDescriptionId}
        onChange={event => setActivityDescription(event.target.value)}
        placeholder="Once you enter a name and description, press the + button"></textarea>
    </form>
  )
}

/**
 * List of activities that can be independently deleted, promoted, and assigned to reporters 
 * @prop activities - list of reporters to display
 * @prop availableReporters - list of reporters that can be assigned to activites
 * @prop removeActivity - callback function for removing a reporter
 * @prop assignActivity - callback function for assigning reporter to an activity
 * @prop promoteActivity - callback function for promoting an activity
 */
function ActivityList({
  activities, availableReporters, removeActivity, assignReporter, promoteActivity
}: {
  activities: Activity[],
  availableReporters: Reporter[],
  removeActivity: (a: Activity) => void,
  assignReporter: (activity: Activity, reporter: Reporter) => void,
  promoteActivity: (a: Activity) => void,
}) {

  const activityListItems = activities.map((activity, idx) =>
    <ActivityCard
      key={idx}
      activity={activity}
      availableReporters={availableReporters}
      removeActivity={removeActivity}
      assignReporter={assignReporter}
      promoteActivity={promoteActivity} />
  )

  return (
    <ul className={styles.activityList}>
      {activityListItems}
    </ul>
  )
}

/**
 * A single activity display card
 * @prop activity - activity to display
 * @prop availableReporters - list of reporters that can be assigned to this activity
 * @prop removeActivity - callback function for removing a reporter
 * @prop assignReporter - callback function for assigning reporter to this activity
 * @prop promoteActivity - callback function for promoting an activity
 */
function ActivityCard({
  activity, availableReporters, removeActivity, assignReporter, promoteActivity
}: {
  activity: Activity,
  availableReporters: Reporter[],
  removeActivity: (activity: Activity) => void,
  assignReporter: (activity: Activity, reporter: Reporter) => void,
  promoteActivity: (activity: Activity) => void,
}) {
  // Name of the reporter assigned to this activity, or "" if no reporter assigned
  const [selectedReporterName, _setSelectedReporter]
    = useState<string>(activity.assignee != null ? activity.assignee.name : "")

  function handleDeleteClick(event: React.MouseEvent<HTMLButtonElement>) {
    // Remove this activity if the remove button is clicked
    event.stopPropagation()
    removeActivity(activity)
  }

  function handleCardClick() {
    // Promote this activity if this card is clicked
    promoteActivity(activity)
  }

  function handleReporterSelectChange(event: React.ChangeEvent<HTMLSelectElement>) {
    const reporterName = event.target.value

    if (reporterName != selectedReporterName) {
      // Get the reporter from the list and assign it
      const reporterToAssign = availableReporters.find(e => e.name === reporterName)
      if (reporterToAssign != null) {
        assignReporter(activity, reporterToAssign)
      }
    }
  }

  const availableReporterOptions = availableReporters.map((reporter, idx) =>
    <option value={reporter.name} key={idx}>
      {reporter.name}
    </option>
  )

  return (
    <li className={styles.activityItem}>
      <div className={styles.activityCard} onClick={handleCardClick}>
        <span className={styles.activityCardHeader}>
          <p className={styles.activityCardTitle}>{activity.name}</p>
          {activity.assignee == null ?
            <button
              className={`${styles.iconButton} ${styles.activityCardDeleteButton}`}
              onClick={handleDeleteClick}>
              <FontAwesomeIcon icon={faTrashCan} />
              Remove
            </button>
            : null
          }
        </span>
        <p className={styles.activityCardDescription}>{activity.description}</p>
        <span className={styles.activityCardReporter}>
          <p className={styles.activityCardReporterLabel}>Reporter:</p>
          {activity.assignee != null ?
            <p>{activity.assignee.name}</p>
            :
            <select
              className={styles.activityCardReporterSelect}
              value={selectedReporterName!}
              onClick={(event) => event.stopPropagation()}
              onChange={handleReporterSelectChange}
            >
              <option value="" disabled hidden>Select a reporter...</option>
              {availableReporterOptions}
            </select>
          }
        </span>
      </div>
    </li>
  )
}

