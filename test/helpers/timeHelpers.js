export const goBackOneDay = () => {
  const now = new Date();
  const oneDayAgo = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1,
                             now.getHours(), now.getMinutes(), now.getSeconds());
  return oneDayAgo;
};
export const goBackOneWeek = () => {
  const now = new Date();
  const oneWeekAgo = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7,
                              now.getHours(), now.getMinutes(), now.getSeconds()); 
  return oneWeekAgo;
};
export const goBackOneMonth = () => {
  const now = new Date();
  const oneMonthAgp = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate(),
                               now.getHours(), now.getMinutes(), now.getSeconds());
  return oneMonthAgp;
};
