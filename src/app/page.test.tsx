import { expect, test } from "vitest"
import Home from "./page"
import { render, fireEvent, cleanup, screen, within } from "@testing-library/react"

test("Starting state input fields exist", () => {
  render(<Home />)

  // Reporter input fields
  const reporterNameInput = screen.getByLabelText(/Enter reporter name:/) as HTMLInputElement
  expect(reporterNameInput).toBeDefined()

  // Activity input fields
  const activityNameInput = screen.getByLabelText(/Enter activity name/) as HTMLInputElement
  expect(activityNameInput).toBeDefined()
  const activityNameDescription = screen.getByLabelText(/Enter activity description/) as HTMLInputElement
  expect(activityNameDescription).toBeDefined()

  cleanup()
})

test("Adding and removing reporters", () => {
  render(<Home />)

  // Reporter input fields
  const reporterNameInput = screen.getByLabelText(/Enter reporter name:/) as HTMLInputElement
  const addButton = screen.getAllByRole("button", { name: /Add/ })[0] as HTMLButtonElement
  const reporterList = screen.getAllByRole("list")[0] as HTMLUListElement

  // Add button is disabled and the list is empty when nothing has been entered
  expect(addButton.disabled).toBe(true)
  expect(within(reporterList).queryAllByRole("listitem")).toHaveLength(0)

  // Add 3 test reporters
  const reporterNames = ["TEST_REPORTER_1", "TEST_REPORTER_2", "TEST_REPORTER_3"]
  reporterNames.forEach((name, idx) => {
    // Input names, then make sure the add button becomes enabled
    fireEvent.change(reporterNameInput, { target: { value: name } })
    expect(addButton.disabled).toBe(false)

    // Click add
    fireEvent.click(addButton)

    // Make sure the input box is cleared and the add button is disabled again
    expect(reporterNameInput.value).toEqual("")
    expect(addButton.disabled).toBe(true)

    // Make sure reporter is added to the list along with all previous reporters
    const reporterItems = within(reporterList).getAllByRole("listitem")
    expect(reporterItems).toHaveLength(idx + 1)
    expect(reporterItems.map(item => item.textContent)).toEqual(reporterNames.slice(0, idx + 1))
  })

  // Clearing the field after typing disables the add button again
  fireEvent.change(reporterNameInput, { target: { value: "x" } })
  expect(addButton.disabled).toBe(false)
  fireEvent.change(reporterNameInput, { target: { value: "" } })
  expect(addButton.disabled).toBe(true)

  // Remove the middle reporter by clicking its trash button
  const middleItem = within(reporterList).getAllByRole("listitem")[1]
  expect(middleItem.textContent).toEqual("TEST_REPORTER_2")
  fireEvent.click(within(middleItem).getByRole("button"))

  // Make sure only the clicked reporter was removed
  const remainingItems = within(reporterList).getAllByRole("listitem")
  expect(remainingItems).toHaveLength(2)
  expect(remainingItems.map(item => item.textContent)).toEqual(["TEST_REPORTER_1", "TEST_REPORTER_3"])

  cleanup()
})

test("Adding activities", () => {
  render(<Home />)

  // Activity input fields
  const activityNameInput = screen.getByLabelText(/Enter activity name/) as HTMLInputElement
  const activityDescriptionInput = screen.getByLabelText(/Enter activity description/) as HTMLTextAreaElement
  const addButton = screen.getAllByRole("button", { name: /Add/ })[1] as HTMLButtonElement
  const activityList = screen.getAllByRole("list")[1] as HTMLUListElement

  // Add button is disabled and the list is empty when nothing has been entered
  expect(addButton.disabled).toBe(true)
  expect(within(activityList).queryAllByRole("listitem")).toHaveLength(0)

  const activities = [
    { name: "TEST_ACTIVITY_1", description: "TEST_DESCRIPTION_1" },
    { name: "TEST_ACTIVITY_2", description: "TEST_DESCRIPTION_2" },
    { name: "TEST_ACTIVITY_3", description: "TEST_DESCRIPTION_3" },
  ]
  activities.forEach(({ name, description }, idx) => {
    // Add button stays disabled with only a name entered
    fireEvent.change(activityNameInput, { target: { value: name } })
    expect(addButton.disabled).toBe(true)

    // Add button becomes enabled once the description is also entered
    fireEvent.change(activityDescriptionInput, { target: { value: description } })
    expect(addButton.disabled).toBe(false)

    // Click add
    fireEvent.click(addButton)

    // Make sure both input fields are cleared and the add button is disabled again
    expect(activityNameInput.value).toEqual("")
    expect(activityDescriptionInput.value).toEqual("")
    expect(addButton.disabled).toBe(true)

    // Make sure an activity card is added to the list along with all previous cards
    const activityCards = within(activityList).getAllByRole("listitem")
    expect(activityCards).toHaveLength(idx + 1)
    activityCards.forEach((card, cardIdx) => {
      expect(within(card).getByText(activities[cardIdx].name)).toBeDefined()
      expect(within(card).getByText(activities[cardIdx].description)).toBeDefined()
    })
  })

  // Add button stays disabled with only a description entered
  fireEvent.change(activityDescriptionInput, { target: { value: "x" } })
  expect(addButton.disabled).toBe(true)
  fireEvent.change(activityDescriptionInput, { target: { value: "" } })

  // Every activity card shows a reporter dropdown and a remove button
  within(activityList).getAllByRole("listitem").forEach(card => {
    const reporterSelect = within(card).getByRole("combobox") as HTMLSelectElement
    expect(reporterSelect.value).toEqual("")
    expect(within(card).getByRole("button", { name: /Remove/ })).toBeDefined()
  })

  cleanup()
})

test("Promoting and removing activities", () => {
  render(<Home />)

  const activityNameInput = screen.getByLabelText(/Enter activity name/) as HTMLInputElement
  const activityDescriptionInput = screen.getByLabelText(/Enter activity description/) as HTMLTextAreaElement
  const addButton = screen.getAllByRole("button", { name: /Add/ })[1] as HTMLButtonElement
  const activityList = screen.getAllByRole("list")[1] as HTMLUListElement

  // Returns the activity names in the order the cards are displayed
  const displayedActivityNames = () =>
    within(activityList).getAllByRole("listitem").map(card => card.querySelector("p")!.textContent)

  // Add 2 activities
  const activities = [
    { name: "TEST_ACTIVITY_1", description: "TEST_DESCRIPTION_1" },
    { name: "TEST_ACTIVITY_2", description: "TEST_DESCRIPTION_2" },
  ]
  activities.forEach(({ name, description }) => {
    fireEvent.change(activityNameInput, { target: { value: name } })
    fireEvent.change(activityDescriptionInput, { target: { value: description } })
    fireEvent.click(addButton)
  })
  expect(displayedActivityNames()).toEqual(["TEST_ACTIVITY_1", "TEST_ACTIVITY_2"])

  // Promote the second activity by clicking its card; it moves to the top
  fireEvent.click(within(activityList).getByText("TEST_ACTIVITY_2"))
  expect(displayedActivityNames()).toEqual(["TEST_ACTIVITY_2", "TEST_ACTIVITY_1"])

  // Remove the top activity by clicking the remove button
  const topCard = within(activityList).getAllByRole("listitem")[0]
  fireEvent.click(within(topCard).getByRole("button", { name: /Remove/ }))
  expect(displayedActivityNames()).toEqual(["TEST_ACTIVITY_1"])

  // Remove the remaining activity. List should become empty
  const lastCard = within(activityList).getAllByRole("listitem")[0]
  fireEvent.click(within(lastCard).getByRole("button", { name: /Remove/ }))
  expect(within(activityList).queryAllByRole("listitem")).toHaveLength(0)

  cleanup()
})

test("Assigning a reporter to an activity", () => {
  render(<Home />)

  const reporterNameInput = screen.getByLabelText(/Enter reporter name:/) as HTMLInputElement
  const activityNameInput = screen.getByLabelText(/Enter activity name/) as HTMLInputElement
  const activityDescriptionInput = screen.getByLabelText(/Enter activity description/) as HTMLTextAreaElement
  const [reporterAddButton, activityAddButton] = screen.getAllByRole("button", { name: /Add/ }) as HTMLButtonElement[]
  const [reporterList, activityList] = screen.getAllByRole("list") as HTMLUListElement[]

  // Add a reporter
  fireEvent.change(reporterNameInput, { target: { value: "TEST_REPORTER" } })
  fireEvent.click(reporterAddButton)

  // Add an activity
  fireEvent.change(activityNameInput, { target: { value: "TEST_ACTIVITY" } })
  fireEvent.change(activityDescriptionInput, { target: { value: "TEST_DESCRIPTION" } })
  fireEvent.click(activityAddButton)

  // The activity's select menu contains the reporter
  const activityCard = within(activityList).getByRole("listitem")
  const reporterSelect = within(activityCard).getByRole("combobox") as HTMLSelectElement
  const reporterOptions = within(reporterSelect).getAllByRole("option") as HTMLOptionElement[]
  expect(reporterOptions.map(option => option.value)).toEqual(["TEST_REPORTER"])

  // Select the reporter
  fireEvent.change(reporterSelect, { target: { value: "TEST_REPORTER" } })

  // The reporter's name replaces the select menu on the activity card
  expect(within(activityCard).queryByRole("combobox")).toBeNull()
  expect(within(activityCard).getByText("TEST_REPORTER")).toBeDefined()

  // The reporter is removed from the reporter list
  expect(within(reporterList).queryAllByRole("listitem")).toHaveLength(0)

  cleanup()
})
