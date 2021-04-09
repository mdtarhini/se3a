//query selectors
const analogClockDiv = document.querySelector("#analogClock");
const secondsHandler = document.querySelector("#secondsHandler");
const minutesHandler = document.querySelector("#minutesHandler");
const hoursHandler = document.querySelector("#hoursHandler");

const rotateHandlers = () => {
  const date = new Date();
  const seconds = date.getSeconds();
  const angleSeconds = 6 * seconds;

  const minutes = date.getMinutes() + seconds / 60;
  const angleMinutes = 6 * minutes;

  const hours = (date.getHours() % 12) + minutes / 60;
  const angleHours = 5 * hours * 6;

  secondsHandler.style.transform = `rotate(${angleSeconds}deg)`;
  minutesHandler.style.transform = `rotate(${angleMinutes}deg)`;
  hoursHandler.style.transform = `rotate(${angleHours}deg)`;

  //recrusive
  setTimeout(() => {
    rotateHandlers();
  }, 1000);
};
rotateHandlers();
