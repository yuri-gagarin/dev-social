/**
 * A date formatter function
 * @param {object} options Options for return value format
 * @return {string} Formatted date string
 */
export default function(options) {
  if (typeof options !== "object") {
    throw new TypeError("Expected the first argument to be {object} : {options}");
  }
  function addZero(val) {
    if (val < 10) {
      return `0${val}`;
    }
    else {
      return val;
    }
  };
  
  let today = new Date();
  let mm = today.getMonth()+1;
  let day = today.getDate();
  let year = today.getFullYear();
  let hour = addZero(today.getHours());
  let minutes = addZero(today.getMinutes());
  let seconds = addZero(today.getSeconds());

  let month;
  switch(mm) {
    case 1: month = "Jan";
    break;
    case 2: month = "Feb";
    break;
    case 3: month = "March";
    break;
    case 4: month = "April";
    break;
    case 5: month = "May";
    break;
    case 6: month = "June";
    break;
    case 7: month = "July";
    break;
    case 8: month = "Aug";
    break;
    case 9: month = "Sep";
    break;
    case 10: month = "Oct";
    break;
    case 11: month = "Nov";
    break;
    case 12: month = "Dec";
    break;
  }

  if (options.format === "slugDate") {
    return `${year}_${addZero(mm)}_${day}_${hour}_${minutes}`;
  }
  else if (options.format === "dateAndHour") {
    return `${month} ${day}, ${year} - ${hour}:${minutes}`;
  }
  else if (options.format === "time") {
    return `${addZero(hour)} : ${addZero(seconds)}`;
  }


};