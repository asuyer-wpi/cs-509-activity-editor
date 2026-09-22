import { expect, test } from "vitest"
import { ActivityEditor, Activity, Reporter } from "./model"

test("Starting state", () => {
  const editor = new ActivityEditor()

  // Both lists should be empty
  expect(editor.activities).toHaveLength(0)
  expect(editor.reporters).toHaveLength(0)
  expect(editor.getAvailableReporters()).toHaveLength(0)
})

test("Adding activities", () => {
  const a = new Activity("a", "abc")
  const b = new Activity("b", "def")

  const startingEditor = new ActivityEditor()
  const e1 = startingEditor.withNewActivity(a)

  // Activity list should contain the added activity
  expect(e1.activities).toHaveLength(1)
  expect(e1.activities[0]).toEqual(a)

  // Add another activity
  const e2 = e1.withNewActivity(b)
  expect(e2.activities).toHaveLength(2)
  expect(e2.activities[0]).toEqual(a)
  expect(e2.activities[1]).toEqual(b)
})

test("Removing activities", () => {
  const a = new Activity("a", "abc")

  // Activities that share similar fields to `a`
  const a1 = new Activity("a", "def")
  const a2 = new Activity("b", "abc")

  const startingEditor = new ActivityEditor()
  const e1 = startingEditor.withNewActivity(a)

  // Remove elements that do not exist (does nothing)
  const e2 = e1.withActivityRemoved(a1)
  expect(e2.activities).toHaveLength(1)
  const e3 = e1.withActivityRemoved(a2)
  expect(e3.activities).toHaveLength(1)

  // Remove the actual activity
  const e4 = e1.withActivityRemoved(a)
  expect(e4.activities).toHaveLength(0)

  // Create activity with assigned reporter
  const r = new Reporter("r")
  const a3 = new Activity("a", "abc", r)

  // Trying to remove an assigned activity should do nothing
  const e5 = e4.withNewActivity(a3)
  const e6 = e5.withActivityRemoved(a3)
  expect(e6.activities).toHaveLength(1)
})

test("Promoting activities", () => {
  const a = new Activity("a", "abc")
  const b = new Activity("b", "def")
  const c = new Activity("c", "hij")

  // Add all 3 activities
  const startingEditor = new ActivityEditor()
  const e1 = startingEditor.withNewActivity(a).withNewActivity(b).withNewActivity(c)

  // Make sure all actities exist in the correct order
  expect(e1.activities).toHaveLength(3)
  expect(e1.activities[0]).toEqual(a)
  expect(e1.activities[1]).toEqual(b)
  expect(e1.activities[2]).toEqual(c)

  // Promote a. List remains the same
  const e2 = e1.withActivityPromoted(a)
  expect(e2.activities).toHaveLength(3)
  expect(e2.activities[0]).toEqual(a)
  expect(e2.activities[1]).toEqual(b)
  expect(e2.activities[2]).toEqual(c)

  // Promote b. List becomes [b, a, c]
  const e3 = e1.withActivityPromoted(b)
  expect(e3.activities).toHaveLength(3)
  expect(e3.activities[0]).toEqual(b)
  expect(e3.activities[1]).toEqual(a)
  expect(e3.activities[2]).toEqual(c)

  // Promote c. List becomes [c, a, b]
  const e4 = e1.withActivityPromoted(c)
  expect(e4.activities).toHaveLength(3)
  expect(e4.activities[0]).toEqual(c)
  expect(e4.activities[1]).toEqual(a)
  expect(e4.activities[2]).toEqual(b)
})

test("Adding reporters", () => {
  const a = new Reporter("a")
  const b = new Reporter("b")

  const startingEditor = new ActivityEditor()
  const e1 = startingEditor.withNewReporter(a)

  // Activity list should contain the added activity
  expect(e1.reporters).toHaveLength(1)
  expect(e1.reporters[0]).toEqual(a)

  // Add another reporter
  const e2 = e1.withNewReporter(b)
  expect(e2.reporters).toHaveLength(2)
  expect(e2.reporters[0]).toEqual(a)
  expect(e2.reporters[1]).toEqual(b)
})

test("Removing reporters", () => {
  const r = new Reporter("a")

  // Decoy reporter
  const r1 = new Reporter("b")

  const startingEditor = new ActivityEditor()
  const e1 = startingEditor.withNewReporter(r)

  // Remove decoy element (does nothing)
  const e2 = e1.withReporterRemoved(r1)
  expect(e2.reporters).toHaveLength(1)

  // Remove the actual activity
  const e3 = e1.withReporterRemoved(r)
  expect(e3.reporters).toHaveLength(0)

  // Create reporter with assigned activity
  const a = new Activity("a", "abc")
  const r2 = new Reporter("r", a)

  // Trying to remove an assigned activity should do nothing
  const e4 = e3.withNewReporter(r2)
  const e5 = e4.withReporterRemoved(r2)
  expect(e5.reporters).toHaveLength(1)
})

test("Assigning activities to reporters", () => {
  const a = new Activity("a", "abc")
  const r = new Reporter("r")

  const startingEditor = new ActivityEditor()
  const e1 = startingEditor.withNewActivity(a).withNewReporter(r)
  expect(e1.getAvailableReporters()).toHaveLength(1)

  // Assign a to r
  const e2 = e1.withActivityAssigned(a, r)

  // Check if activity and reporter are assigned
  expect(e2.activities).toHaveLength(1)
  expect(e2.activities[0]).toEqual(new Activity("a", "abc", r))
  expect(e2.reporters).toHaveLength(1)
  expect(e2.reporters[0]).toEqual(new Reporter("r", a))

  // Make sure no reportes are available
  expect(e2.getAvailableReporters()).toHaveLength(0)
})

