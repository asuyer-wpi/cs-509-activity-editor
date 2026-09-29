# ActivityEditor

**ActivityEditor** is an app where you (an editor) can maintain a list of activities and
reporters. You can add and remove reporters and activities, promote activities, and assign
reporters to activities.

## Building and running

Run the commands:

```sh
npm install
npm run dev
```

Then navigate to `localhost:3000` in your browser.

Some other commands you may want to run:

```sh
npm run test                    # run test cases
npm run test -- --coverage      # run test cases with code coverage
npm run lint                    # run linter
npm run build                   # compile site into static webpages
npm run start                   # start the compiled site
```

## Usage

The website has 2 major sections: Reporters and Activities. You can add reporters or
activities by entering a name and (for activities) a description into the text fields,
then clicking the Add (`+`) button. Reporters and activities are displayed as a list in
their corresponding sections. New reporters/activities are added to the bottom of the list.
(*Use cases: Add Reporter, Append Activity*)

Unassigned reporters and activities have a delete button to remove the item entirely. This
can only be done on reporters that have not been assigned to an activity and to activities
that do not have a reporter assigned to it. (*Use cases: Remove Activity, Remove
Reporter*)

An activity can be promoted by clicking on it. When you hover your cursor over an
activity, it will highlight blue to show that it can be clicked. When you click on it, it
will be moved to the top of the list. (*Use case: Promote Activity*)

A reporter can be assigned to an activity by selected it from a dropdown menu on an
activity card of an unassigned event. Once a reporter is assigned to an activity, it is
removed from the list in the reporters section and put on the corresponding event card.
Notice that event cards with assigned reporters no longer have a delete button. (*Use
case: Assign Reporter*)

