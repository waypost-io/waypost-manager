import flags from "../reducers/flags";
import {
  fetchFlagsSuccess,
  createFlagSuccess,
  deleteFlagSuccess,
  toggleFlagSuccess,
  editFlagSuccess,
} from "../actions/flagActions";

const testFlags = [
  {
    id: 1,
    name: "Test flag 1",
    description: "Test description",
    status: true,
    percentage_split: 50,
  },
  {
    id: 2,
    name: "Test flag 2",
    description: "Another description",
    status: false,
    percentage_split: 50,
  },
];

describe("Flag reducer", () => {
  it("returns the initial state", () => {
    expect(flags(undefined, {})).toEqual([]);
  });

  it("returns fetched flags", () => {
    expect(flags([], fetchFlagsSuccess(testFlags))).toEqual(testFlags);
  });

  it("handles new flag added to empty list", () => {
    const previousState = [];
    const newFlag = testFlags[0];
    expect(flags(previousState, createFlagSuccess(newFlag))).toEqual([newFlag]);
  });

  it("handles new flag added to existing list", () => {
    const previousState = [testFlags[0]];
    const newFlag = testFlags[1];
    expect(flags(previousState, createFlagSuccess(newFlag))).toEqual(testFlags);
  });

  it("handles flag deletion", () => {
    const previousState = testFlags;
    expect(flags(previousState, deleteFlagSuccess(1))).toEqual([testFlags[1]]);
  });

  it("handles toggle flag", () => {
    const previousState = testFlags;
    const updatedFlag = { ...testFlags[0], status: false };
    expect(flags(previousState, toggleFlagSuccess(updatedFlag))).toEqual([
      {
        id: 1,
        name: "Test flag 1",
        description: "Test description",
        status: false,
        percentage_split: 50,
      },
      {
        id: 2,
        name: "Test flag 2",
        description: "Another description",
        status: false,
        percentage_split: 50,
      },
    ]);
  });

  it("handles edit flag name", () => {
    const previousState = testFlags;
    const updatedFlag = { ...testFlags[0], name: "New Name" };
    expect(flags(previousState, editFlagSuccess(updatedFlag))).toEqual([
      {
        id: 1,
        name: "New Name",
        description: "Test description",
        status: true,
        percentage_split: 50,
      },
      {
        id: 2,
        name: "Test flag 2",
        description: "Another description",
        status: false,
        percentage_split: 50,
      },
    ]);
  });
});
