export default function() {

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
  return `${month} ${day}, ${year} - ${hour}:${minutes}`;

}