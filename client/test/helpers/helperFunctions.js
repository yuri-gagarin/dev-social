export const setElem = (wrapper, testElement)  => {
  return wrapper.find(`[data-test="${testElement}"]`);
};
