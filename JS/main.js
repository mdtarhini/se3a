/*
First part:
The analog clock animation
*/
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

/*/
Second part:
The time in lebanese
*/
const AND_CONJUNCTION = "و";
const PAST_CONJUNCTION = "إلا";
const MINUTE_SUFFIX_SINGULAR = "دقيقة";
const MINUTE_SUFFIX_PLURAL = "دقايق";
const NUMBERS_TO_LEBANESE = {
  1: {
    forMinutes: "دقيقة",
    forHours: "وحدة",
    asUnit: "وحده",
    skipMinutesSuffix: true,
  },
  2: {
    forMinutes: "دقيقتين",
    forHours: "تنتين",
    asUnit: "تنين",
    asTens: "عشرين",
    skipMinutesSuffix: true,
  },
  3: {
    forMinutes: "تلات",
    forHours: "تلاتة",
    asUnit: "تلاته",
    asTens: "تلاتين",
  },
  4: {
    forMinutes: "أربع",
    forHours: "أربعة",
    asUnit: "أربعه",
    asTens: "أربعين",
  },
  5: {
    forMinutes: "خمسة",
    forHours: "خمسة",
    asUnit: "خمسَه",
    asTens: "خمسين",
    skipMinutesSuffix: true,
  },
  6: { forMinutes: "ست", forHours: "ستة", asUnit: "ستَه" },
  7: { forMinutes: "سبع", forHours: "سبعة", asUnit: "سبعه" },
  8: { forMinutes: "تمان", forHours: "تمانة", asUnit: "تمانَه" },
  9: { forMinutes: "تسع", forHours: "تسعة", asUnit: "تسعه" },

  //The rules of 10-19 are quite ranodm...
  10: { forMinutes: "عشرة", forHours: "عشرة", skipMinutesSuffix: true },
  11: { forMinutes: "حدعشر", forHours: "حدعش" },
  12: { forMinutes: "طنعشر", forHours: "طنعش" },
  13: { forMinutes: "تلطعشر" },
  14: { forMinutes: "اربعطعشر" },
  15: { forMinutes: "ربع", skipMinutesSuffix: true },
  16: { forMinutes: "سطعشر" },
  17: { forMinutes: "سبعطعشر" },
  18: { forMinutes: "تمنطعشر" },
  19: { forMinutes: "تسعطعشر" },

  //Other Special cases
  20: { forMinutes: "تلت", skipMinutesSuffix: true },
  25: { forMinutes: "نص الا خمسة", skipMinutesSuffix: true },
  30: { forMinutes: "نص", skipMinutesSuffix: true },
  35: { forMinutes: "نص و خمسة", skipMinutesSuffix: true },
};

hoursAndMinutesToLebanese = (hours = 3, minutes = 10) => {
  /*process the hours:
  1- 12h format (in some case (where the format is like five to something, you convert the i+1 hour))
  2- get the corresponding expression from the dict
  */

  const hoursTwelveFormat = (minutes <= 39 ? hours : hours + 1) % 12 || 12;

  const hoursInLebanese = NUMBERS_TO_LEBANESE[hoursTwelveFormat].forHours;

  /*prcess the minutes:
    1- if the minutes number is >= 40, take the difference from 60 (will be using the past conjunction)
    2- check if the number exists in the dictionary (<20 or a special case)
    3- if not, get the units and tens and convert it accordignly
  */
  let minutesInLebanese = "";
  let conjunction = "";
  let minutesSuffix = "";

  if (minutes) {
    //decide on the conjunction based on the minutes:
    if (minutes >= 40) {
      conjunction = PAST_CONJUNCTION;
      minutes = 60 - minutes;
    } else {
      conjunction = AND_CONJUNCTION;
    }
    if (NUMBERS_TO_LEBANESE[minutes]) {
      minutesInLebanese = NUMBERS_TO_LEBANESE[minutes].forMinutes;
      if (NUMBERS_TO_LEBANESE[minutes].skipMinutesSuffix) {
        minutesSuffix = "";
      } else {
        minutesSuffix =
          minutes <= 10 ? MINUTE_SUFFIX_PLURAL : MINUTE_SUFFIX_SINGULAR;
      }
    } else {
      const minutesUnit = minutes % 10;
      const minutesTens = Math.floor(minutes / 10);

      minutesInLebanese = `${
        minutesUnit
          ? NUMBERS_TO_LEBANESE[minutesUnit].asUnit + ` ${AND_CONJUNCTION} `
          : ""
      }${minutesTens ? NUMBERS_TO_LEBANESE[minutesTens].asTens : ""}`;
      minutesSuffix = minutesInLebanese
        ? minutes <= 10
          ? MINUTE_SUFFIX_PLURAL
          : MINUTE_SUFFIX_SINGULAR
        : "";
    }
  }

  //Merge adn return the three expressions:

  return `${hoursInLebanese}${conjunction ? " " : ""}${conjunction}${
    minutesInLebanese ? " " : ""
  }${minutesInLebanese}${minutesSuffix ? " " : ""}${minutesSuffix}`;
};

const getTimeInLebanese = (date) => {
  if (typeof date === "undefined") {
    date = new Date();
    return hoursAndMinutesToLebanese(date.getHours(), date.getMinutes());
  } else if (Object.prototype.toString.call(date) === "[object Date]") {
    return hoursAndMinutesToLebanese(date.getHours(), date.getMinutes());
  } else if (
    typeof date === "string" &&
    /^([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/.test(date)
  ) {
    const hours = Number(date.split(":")[0]);
    const minutes = Number(date.split(":")[1]);
    return hoursAndMinutesToLebanese(hours, minutes);
  } else {
    return "Not Valid";
  }
};

//The div hosting the time
const timeInLebaneseDiv = document.getElementById("timeInLebanese");

const updateTimeOnPage = () => {
  timeInLebaneseDiv.textContent = getTimeInLebanese();
};

const updateTimeOnPagePeriodically = () => {
  //Get how many seconds until the next full minute:
  const date = new Date();
  const secsUntilNextMinute = 60 - date.getSeconds();
  setTimeout(() => {
    updateTimeOnPage();
    setInterval(() => {
      updateTimeOnPage();
    }, 60000);
  }, 1000 * secsUntilNextMinute);
};

/*
Main calls when window is loaded
*/
window.onload = () => {
  updateTimeOnPage();
  updateTimeOnPagePeriodically();

  rotateHandlers();
};

/*
PWA: check and register service worker
*/
// if ("serviceWorker" in navigator) {
//   window.addEventListener("load", () => {
//     navigator.serviceWorker.register("../sw.js").then(() => {
//       console.log("Service Worker Registered");
//     });
//   });
// }

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("../service-worker.js")
      .then(() => console.log("service worker registered"))
      .catch((err) => console.log("service worker not registered", err));
  });
}
