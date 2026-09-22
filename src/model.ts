/**
 * An ActivityEditor has immutable lists of activities and reporters. It can add or remove 
 * Activities and Reporters, promote Activities, and assign Activities to Reporters. All "mutating"
 * operations return a new ActivityEditor object instead of modifying an instance in place.
 */
export class ActivityEditor {

  public readonly activities: Activity[]
  public readonly reporters: Reporter[]

  constructor(activities?: Activity[], reporters?: Reporter[]) {
    this.activities = activities ?? []
    this.reporters = reporters ?? []
  }

  /**
   * Returns a new ActivityEditor with the Activity `a` added.
   */
  withNewActivity(a: Activity): ActivityEditor {
    return new ActivityEditor(
      [...this.activities, a],
      this.reporters
    )
  }

  /**
   * Returns a new ActivityEditor with the Activity `a` removed. If `a` is not a listed activity 
   * or `a` has an assigned reporter, does nothing.
   */
  withActivityRemoved(a: Activity): ActivityEditor {
    // Do not remove if Activity does not exist or it is assigned
    if (this.activities.indexOf(a) === -1 || a.assignee != null) {
      return this
    }

    return new ActivityEditor(
      this.activities.filter(e => e !== a),
      this.reporters
    )
  }

  /**
   * Returns a new ActivityEditor with the Reporter `r` added.
   */
  withNewReporter(r: Reporter): ActivityEditor {
    return new ActivityEditor(
      this.activities,
      [...this.reporters, r]
    )
  }

  /**
   * Returns a new ActivityEditor with the Reporter `r` removed. If `r` is not a listed reporter 
   * or `r` is assigned to an Activity, does nothing.
   */
  withReporterRemoved(r: Reporter): ActivityEditor {
    // Do not remove if Reporter does not exist or it is assigned
    if (this.reporters.indexOf(r) === -1 || r.assignedTo != null) {
      return this
    }

    return new ActivityEditor(
      this.activities,
      this.reporters.filter(e => e !== r)
    )
  }

  /**
   * Returns all reporters that are not already assigned to an Activity.
   */
  getAvailableReporters(): Reporter[] {
    return this.reporters.filter(e => e.assignedTo == null)
  }

  /**
   * Returns a new ActivityEditor with the Activity `a` at the front of the activities list.
   */
  withActivityPromoted(a: Activity): ActivityEditor {
    // Do nothing if this activity does not exist or is already at the front
    if (this.activities.indexOf(a) <= 0) {
      return this
    }

    return new ActivityEditor(
      [a, ...this.activities.filter(e => e !== a)],
      this.reporters
    )
  }

  /**
   * Returns a new ActivityEditor with the Reporter `r` assigned to the Activity `a`.
   */
  withActivityAssigned(a: Activity, r: Reporter): ActivityEditor {
    return new ActivityEditor(
      [
        new Activity(a.name, a.description, r),
        ...this.activities.filter(e => e !== a)
      ],
      [
        new Reporter(r.name, a),
        ...this.reporters.filter(e => e !== r)
      ]
    )
  }
}

/**
 * An Activity has a short name and a description. An Activity can have a Reporter assigned to it
 */
export class Activity {
  name: string
  description: string
  assignee: Reporter | null

  constructor(name: string, description: string, assignee?: Reporter) {
    this.name = name
    this.description = description
    this.assignee = assignee ?? null
  }

  /**
   * Set `r` as the reporter assigned to this Activity
   * @param r - Reporter to set as assignee
   */
  setAssignee(r: Reporter) {
    this.assignee = r
  }
}


/**
 * A Reporter has a name. A Reporter can be assigned to an Activity
 */
export class Reporter {
  name: string
  assignedTo: Activity | null

  constructor(name: string, assignedTo?: Activity) {
    this.name = name
    this.assignedTo = assignedTo ?? null
  }

  /**
   * Assign `a` to this Reporter
   * @param a - Activity to assign
   */
  assignTo(a: Activity) {
    this.assignedTo = a
  }
}

