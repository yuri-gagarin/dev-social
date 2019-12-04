export const setElem = (wrapper, testElement)  => {
  return wrapper.find(`[data-test="${testElement}"]`);
};
/**
 * Checks if a passed object is an error.
 * @param {object} objToCheck - A javascript object.
 */
export const isError = (objToCheck) => {
  return objToCheck && objToCheck.message && objToCheck.stack
};