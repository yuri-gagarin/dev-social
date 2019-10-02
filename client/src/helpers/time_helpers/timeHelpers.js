import {postSearchOptions} from "../helpers/constants/queryOptions.js";
export const rewind = {
  goBackOneDay: () => {
    const now = new Date();
    const oneDayAgo = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1,
                               now.getHours(), now.getMinutes(), now.getSeconds());
    return oneDayAgo;
  },
  goBackOneWeek: () => {
    const now = new Date();
    const oneWeekAgo = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7,
                                now.getHours(), now.getMinutes(), now.getSeconds()); 
    return oneWeekAgo;
  },
  goBackOneMonth: () => {
    const now = new Date();
    const oneMonthAgp = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate(),
                                 now.getHours(), now.getMinutes(), now.getSeconds());
    return oneMonthAgp;
  },
  goBackOneYear: () => {
  const now = new Date();
  const oneYearAgo = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate(),
                              now.getHours(), now.getMinutes(), now.getSeconds());
  return oneYearAgo;
  },
  withinOneDay: () => {
  const now = new Date();
  const hours = Math.floor(Math.random() * 24);
  const aDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(),
                        now.getHours() - hours, now.getMinutes(), now.getSeconds());
  return aDay;
  },
  withinOneWeek: () => {
  const now  = new Date();
  const days = Math.floor(Math.random() * 7);
  const aWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate() - days,
                         now.getHours(), now.getMinutes(), now.getSeconds());
  return aWeek;
  },
  withinOneMonth: () => {
  const now = new Date();
  const days = Math.floor(Math.random() * 30);
  const aMonth = new Date(now.getFullYear(), now.getMonth(), now.getDate() - days,
                          now.getHours(), now.getMinutes(), now.getSeconds());
  return aMonth;
  },
  withinOneYear: () => {
  const now = new Date();
  const months = Math.floor(Math.random() * 12);
  const aYear = new Date(now.getFullYear(), now.getMonth() - months, now.getDate(),
                         now.getHours(), now.getMinutes(), now.getSeconds());
  return aYear;
  }
};
/**
 * Creates a random date within two constraints.
 * @param {Date} from - From date.
 * @param {Date} to - To date.
 * @returns {Date} A Date object fitting within to/from constraints.
 */
export const withinTimeConstraint = (from, to) => {
  const lowerConstraint = from.getTime();
  const upperConstaint = to.getTime();
  return new Date(lowerConstraint + (Math.random() * (upperConstaint - lowerConstraint)));
};

/**
 * Converts a string time query to a Date.
 * @param {string} timeQuery - A string representing the lower time constraint for the MongoDB query.
 * @param {object} queryOptions - A query options object to compare the passed in time query.
 * @returns {Date} A Date object for the query.
 */
export const convertTimeQuery = (timeQuery, queryOptions) => {
  switch (timeQuery) {
    case(queryOptions.time.day):
      return rewind.goBackOneDay();
    case(queryOptions.time.week):
      return rewind.goBackOneWeek();
    case (queryOptions.time.month):
      return rewind.goBackOneMonth();
    case (queryOptions.time.year):
      return rewind.goBackOneYear();
    default:
      return rewind.goBackOneWeek();
  } 
};