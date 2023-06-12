import { registerUser } from "./common.js";

function generateRandomPassword() {
  const specialChars = "!@#$%^&*()_+-";
  const uppercaseLetters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const numbers = "0123456789";
  const lowercaseLetters = "abcdefghijklmnopqrstuvwxyz";

  const passwordLength = 16;
  const requiredSpecialChars = 4;
  const requiredUppercaseLetters = 4;
  const requiredNumbers = 4;

  // Generate the required number of special characters
  let password = generateRandomCharacters(specialChars, requiredSpecialChars);

  // Generate the required number of uppercase letters
  password += generateRandomCharacters(
    uppercaseLetters,
    requiredUppercaseLetters
  );

  // Generate the required number of numbers
  password += generateRandomCharacters(numbers, requiredNumbers);

  // Generate the remaining characters using lowercase letters
  const remainingLength = passwordLength - password.length;
  password += generateRandomCharacters(lowercaseLetters, remainingLength);

  // Shuffle the password string randomly
  const shuffledPassword = shuffleString(password);

  return shuffledPassword;
}

function getRandomNumberInRange(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateRandomCharacters(charset, count) {
  let randomCharacters = "";
  for (let i = 0; i < count; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    randomCharacters += charset[randomIndex];
  }
  return randomCharacters;
}

function shuffleString(string) {
  const characters = string.split("");
  for (let i = characters.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [characters[i], characters[j]] = [characters[j], characters[i]];
  }
  return characters.join("");
}
const Toast = Swal.mixin({
  toast: true,
  position: "top-end",
  showConfirmButton: false,
  timer: 2500,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.addEventListener("mouseenter", Swal.stopTimer);
    toast.addEventListener("mouseleave", Swal.resumeTimer);
  },
});

const genPassword = document.getElementById("generate-password");
const addUserForm = document.getElementById("add-user-form");
const fName = document.getElementById("firstName");
const lName = document.getElementById("lastName");
const email = document.getElementById("email");
const userType = document.getElementById("userType");
const passwordField = document.getElementById("password");

genPassword.addEventListener("click", function () {
  const randomPassword = generateRandomPassword();
  passwordField.value = randomPassword;
});

addUserForm.addEventListener("submit", function (e) {
  e.preventDefault();

  const route = "/auth/signup";
  const userInfo = {
    name: fName.value + " " + lName.value,
    email: email.value,
    password: passwordField.value,
    role: userType.value,
    address: "",
  };

  console.log(userInfo);
  registerUser(userInfo, route).then((res) => {
    console.log(res);
    Swal.fire({
      position: "top-end",
      icon: "error",
      title: `${res.message}`,
      showConfirmButton: false,
      timer: 2500,
    });
  });
});
