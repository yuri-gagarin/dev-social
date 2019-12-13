
/**
 * Checks if a value is a non empty object.
 * @param {Object} value - Variable to check.
 * @returns {boolean} - {True} if is NOT an object or object is empty, {False} if IS a NON EMPTY {object} type.
 */
export const isEmpty = (value) => {
  return (
    value === undefined ||
    value === null ||
    (typeof value === "object" && Object.keys(value).length === 0) ||
    (typeof value === "string" && value.trim().length === 0)
  );
};

/**
 * Checks if a passed object is an error.
 * @param {object} objToCheck - A javascript object.
 */
export const isError = (objToCheck) => {
  return objToCheck && objToCheck.message && objToCheck.stack
};