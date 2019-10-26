export const rewind = {
  /**
   * Goes back one day.
   * @returns {Date} Date one dat ago.
   */
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
    const oneMonthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate(),
                                 now.getHours(), now.getMinutes(), now.getSeconds());
    return oneMonthAgo;
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
  const minutes = Math.floor(Math.random() * 60);
  const seconds = Math.floor(Math.random() * 60);
  const aDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(),
                        now.getHours() - hours, now.getMinutes() - minutes, now.getSeconds() - seconds);
  return aDay;
  },
  withinOneWeek: () => {
  const now  = new Date();
  const days = Math.floor(Math.random() * 7);
  const hours = Math.floor(Math.random() * 24);
  const minutes = Math.floor(Math.random() * 60);
  const seconds = Math.floor(Math.random() * 60);
  const aWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate() - days,
                         now.getHours() - hours, now.getMinutes() - minutes, now.getSeconds() - seconds);
  return aWeek;
  },
  withinOneMonth: () => {
  const now = new Date();
  const days = Math.floor(Math.random() * 30);
  const hours = Math.floor(Math.random() * 24);
  const minutes = Math.floor(Math.random() * 60);
  const seconds = Math.floor(Math.random() * 60);
  const aMonth = new Date(now.getFullYear(), now.getMonth(), now.getDate() - days,
                          now.getHours() - hours, now.getMinutes() - minutes, now.getSeconds() - seconds);
  return aMonth;
  },
  withinOneYear: () => {
  const now = new Date();
  const months = Math.floor(Math.random() * 12);
  const days = Math.floor(Math.random() * 30);
  const hours = Math.floor(Math.random() * 24);
  const minutes = Math.floor(Math.random() * 60);
  const seconds = Math.floor(Math.random() * 60);
  const aYear = new Date(now.getFullYear(), now.getMonth() - months, now.getDate() - days,
                         now.getHours() - hours, now.getMinutes() - minutes, now.getSeconds() - seconds);
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
 * @param {Object} queryOptions - A query options object to compare the passed in time query.
 * @returns {Date} A Date object for the query.
 */
export const convertTimeQuery = (timeQuery, queryOptions) => {
  if(timeQuery && (typeof timeQuery === "string")) {
    switch (timeQuery.toLowerCase()) {
      case(queryOptions.time.day):
        return rewind.goBackOneDay();
      case(queryOptions.time.week):
        return rewind.goBackOneWeek();
      case (queryOptions.time.month):
        return rewind.goBackOneMonth();
      case (queryOptions.time.year):
        return rewind.goBackOneYear();
      default:
        return rewind.goBackOneDay();
    } 
  }
  else {
    return rewind.goBackOneDay();
  }
};