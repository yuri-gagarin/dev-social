export const toggleClose = (event) => {
  const targetBtn = event.target.getAttribute("data-value");
  if(!targetBtn) {
    return null;
  };
  console.log(event);
};

export const toggleOpen = (event) => {
  const targetBtn = evnet.target.getAttribute("data-value");
  if(!targetBtn) {
    return null;
  }
  console.log(event);
}