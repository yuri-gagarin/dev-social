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
export const goBackOneYear = () => {
  const now = new Date();
  const oneYearAgo = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate(),
                              now.getHours(), now.getMinutes(), now.getSeconds());
  return oneYearAgo;
};
export const withinOneDay = () => {
  const now = new Date();
  const hours = Math.floor(Math.random() * 24);
  const aDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(),
                        now.getHours() - hours, now.getMinutes(), now.getSeconds());
  return aDay;
};
export const withinOneWeek = () => {
  const now  = new Date();
  const days = Math.floor(Math.random() * 7);
  const aWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate() - days,
                         now.getHours(), now.getMinutes(), now.getSeconds());
  return aWeek;
};
export const withinOneMonth = () => {
  const now = new Date();
  const days = Math.floor(Math.random() * 30);
  const aMonth = new Date(now.getFullYear(), now.getMonth(), now.getDate() - days,
                          now.getHours(), now.getMinutes(), now.getSeconds());
  return aMonth;
};
export const withinOneYear = () => {
  const now = new Date();
  const months = Math.floor(Math.random() * 12);
  const aYear = new Date(now.getFullYear(), now.getMonth() - months, now.getDate(),
                         now.getHours(), now.getMinutes(), now.getSeconds());
  return aYear;
};