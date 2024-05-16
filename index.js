const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const displayLength = document.querySelector("[data-lengthNumber]");
const inputSlider = document.querySelector("[data-lengthSlider]");
const copyBtn = document.querySelector(".copy-btn");
const copyMsg = document.querySelector(".copy-msg");
const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const numbersCheck = document.querySelector("#numbers");
const symbolsCheck = document.querySelector("#symbols");
const indicator = document.querySelector("[data-indicator]");
const generateBtn = document.querySelector(".generate-btn");
const allCheckBox = document.querySelectorAll("input[type=checkbox]");

const symbols = "~`!@#$%^&*()_+-=/?[]{}|\";:'<>,.";

// initially
let password = "";
let passwordLength = 10;
let checkCount = 0;
handleSlider();
// set strength circle color to gray
setIndicator("#ccc");

// set password length
function handleSlider() {
  inputSlider.value = passwordLength;
  displayLength.innerText = passwordLength;
}

function setIndicator(color) {
  indicator.style.backgroundColor = color;
  indicator.style.boxShadow = `2px 4px 10px ${color}`;
}

function getRndInteger(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function generateUpperCase() {
  return String.fromCharCode(getRndInteger(65, 91));
}

function generateLowerCase() {
  return String.fromCharCode(getRndInteger(97, 123));
}

function generateRndNumber() {
  return getRndInteger(0, 9);
}

function generateSymbol() {
  const randNum = getRndInteger(0, symbols.length);
  return symbols.charAt(randNum);
}

function calcStrength() {
  let hasUpper = false;
  let hasLower = false;
  let hasNum = false;
  let hasSym = false;

  if (uppercaseCheck && uppercaseCheck.checked) hasUpper = true;
  if (lowercaseCheck && lowercaseCheck.checked) hasLower = true;
  if (numbersCheck && numbersCheck.checked) hasNum = true;
  if (symbolsCheck && symbolsCheck.checked) hasSym = true;

  if (hasUpper && hasLower && (hasNum || hasSym) && passwordLength >= 8) {
    setIndicator("#0f0");
  } else if (
    (hasLower || hasUpper) &&
    (hasNum || hasSym) &&
    passwordLength >= 6
  ) {
    setIndicator("#ff0");
  } else {
    setIndicator("#f00");
  }
}

async function copyContent() {
  try {
    await navigator.clipboard.writeText(passwordDisplay.value);
    copyMsg.innerText = "Copied";
  } catch (e) {
    copyMsg.innerText = "Failed";
  }

  // to make copy span
  copyMsg.classList.add("active");

  setTimeout(() => {
    copyMsg.classList.remove("active");
  }, 2000);
}

// shufflepassword
function shufflePassword(array) {
  // Fisher Yates Method
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }

  let str = "";
  array.forEach((el) => (str += el));
  return str;
}

function handleCheckBoxChange() {
  checkCount = 0;
  allCheckBox.forEach((checkbox) => {
    if (checkbox.checked) {
      checkCount++;
    }
  });

  // special condition
  if (passwordLength < checkCount) {
    passwordLength = checkCount;
    handleSlider();
  }
}

allCheckBox.forEach((checkbox) => {
  checkbox.addEventListener("change", handleCheckBoxChange);
});

inputSlider.addEventListener("input", (e) => {
  passwordLength = e.target.value;
  handleSlider();
});

copyBtn.addEventListener("click", () => {
  if (passwordDisplay.value) {
    copyContent();
  }
});

generateBtn.addEventListener("click", () => {
  if (checkCount == 0) {
    return;
  }

  if (passwordLength < checkCount) {
    passwordLength = checkCount;
    handleSlider();
  }

  console.log("Starting the journey");

  // remove old password
  password = "";

  // let's put the stuff mentioned by checkboxes

  // if(uppercaseCheck.checked) {
  //     password += generateUpperCase();
  // }

  // if(lowercaseCheck.checked) {
  //     password += generateLowerCase();
  // }

  // if(numbersCheck.checked) {
  //     password += generateRandomNumber();
  // }

  // if(symbolsCheck.checked) {
  //     password += generateSymbol();
  // }

  let funcArr = [];

  if (uppercaseCheck.checked) {
    funcArr.push(generateUpperCase);
  }

  if (lowercaseCheck.checked) {
    funcArr.push(generateLowerCase);
  }

  if (numbersCheck.checked) {
    funcArr.push(generateRndNumber);
  }

  if (symbolsCheck.checked) {
    funcArr.push(generateSymbol);
  }

  // compulsory addition
  for (let i = 0; i < funcArr.length; i++) {
    password += funcArr[i]();
  }

  console.log("Compulsory addition done");

  // Remaining addition
  for (let i = 0; i < passwordLength - funcArr.length; i++) {
    let randIndex = getRndInteger(0, funcArr.length);
    console.log("randIndex" + randIndex);
    password += funcArr[randIndex]();
  }

  console.log("Remaining addition done");

  // Shuffle the password
  password = shufflePassword(Array.from(password));
  console.log("Shuffling done");

  // Show in UI

  passwordDisplay.value = password;
  console.log("UI addition done");

  // Calculate strength
  calcStrength();
});
