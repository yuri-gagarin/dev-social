import { mergeItems } from "../../src/helpers/rendering/displayHelpers";

describe("Helper Function  unit tests", () => {
  describe(`{mergeItems} unit function test`, () => {
    it("Should return an empty array if no arguments passed", () => {
      const expectedArr = [];
      expect(mergeItems(undefined, undefined)).toEqual(expectedArr);
    });
    it("Should return the old state if no second arg provided", () => {
      const firstArr = [
        {_id: 1, data: "something"},
        {_id: 2, data: "something"},
        {_id: 3, data: "something"}
      ];
      const expectedArr = [...firstArr];

      expect(mergeItems(firstArr, undefined)).toEqual(expectedArr);
    });
    
    it("Should merge two arrays of objects by id", () => {

      const firstArr = [
        {_id: 1, data: "something"},
        {_id: 2, data: "something"},
        {_id: 3, data: "something"}
      ];
      const secondArr = [
        {_id: 4, data: "Something"},
        {_id: 5, data: "Something"}
      ];
      const expectedArr = [...firstArr, ...secondArr];

      expect(mergeItems(firstArr, secondArr)).toEqual(expectedArr);
    });

    it("Should merge two arrays of duplicate items and preserver order", () => {
      const firstArr = [
        {_id: 1, data: "something"},
        {_id: 2, data: "something"},
        {_id: 3, data: "something"}
      ];
      const secondArr = [
        {_id: 1, data: "updated"},
        {_id: 3, data: "updated"},
        {_id: 4, data: "Something"},
        {_id: 5, data: "Something"}
      ];

      const expectedArr = [
        {_id: 1, data: "updated"},
        {_id: 2, data: "something"},
        {_id: 3, data: "updated"},
        {_id: 4, data: "Something"},
        {_id: 5, data: "Something"}
      ];

      expect(mergeItems(firstArr, secondArr)).toEqual(expectedArr);
    });
  });
});
