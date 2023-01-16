export function formatDate(date) {
  date = new Date(date);

  let month = date.getMonth();
  let day = date.getDate();
  let year = date.getFullYear();
  let weekday = date.getDay();

  let months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  let weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  let formatted =
    weekdays[weekday] + " " + months[month] + " " + day + " " + year;

  return formatted;
}
