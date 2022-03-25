import customAssignments from "../reducers/customAssignments";
import {
  deleteAssignmentsOnFlagSuccess,
  fetchAllAssignmentsSuccess,
  fetchAssignmentsOnFlagSuccess,
  addAssignmentsSuccess,
} from "../actions/cAssignmentActions";

const testAssignments = {
  '1': { 'user123': true, 'user234': false, 'user456': true },
  '2': { 'user123': false,  'user888': false},
}

const assignmentsOnOne = { '1': testAssignments['1']};

describe("Custom Assignments Reducer", () => {
  it("returns initial state", () => {
    expect(customAssignments(undefined, {})).toEqual({});
  });

  it("returns fetched custom assignments", () => {
    expect(customAssignments({}, fetchAllAssignmentsSuccess(testAssignments))).toEqual(
      testAssignments
    );
  });

  it("fetches custom assignments on flag", () => {
    expect(customAssignments({}, fetchAssignmentsOnFlagSuccess(1, assignmentsOnOne))).toEqual(
      assignmentsOnOne
    );
  });

  it("deletes assignment on flag", () => {
    const assignmentWithDeletedUsersOnOne = {
      '1': { 'user456': true },
      '2': { 'user123': false,  'user888': false},
    }
    expect(customAssignments(testAssignments, deleteAssignmentsOnFlagSuccess(1, ['user123', 'user234']))).toEqual(
      assignmentWithDeletedUsersOnOne
    )
  });

  it("adds assignment to flag", () => {
    const assignmentWithNewUser = JSON.parse(JSON.stringify(testAssignments));
    assignmentWithNewUser['1']['user999'] = true;
    assignmentWithNewUser['1']['user1010'] = false;
    const newAssignments = { '1': {'user999': true, 'user1010': false }};
    expect(customAssignments(testAssignments, addAssignmentsSuccess(newAssignments))).toEqual(
      assignmentWithNewUser
    )
  })
});
