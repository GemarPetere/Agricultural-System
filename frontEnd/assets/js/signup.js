"use strict";

import { registerUser } from "./common.js";

const signupForm = document.getElementById("signupForm");
const isUserLoggedIn = localStorage.getItem("userToken");

if (isUserLoggedIn) {
    window.location.href = "../admin/index.html"
}

signupForm.addEventListener("submit", function (e) {
  e.preventDefault();

  const route = "/auth/signup";

  const userInfo = {
    name:
      signupForm.elements["firstname"].value +
      " " +
      signupForm.elements["lastname"].value,
    email: signupForm.elements["email"].value,
    password: signupForm.elements["password"].value,
    address: signupForm.elements["address"].value,
  };

  registerUser(userInfo, route).then((res) => {
    if (res.message === "successfully signup") {

      Swal.fire({
        position: "top-end",
        icon: "success",
        title: "You are successfully signed up!",
        showConfirmButton: false,
        timer: 2500,
      });

      setTimeout(() => {
        window.location.href = "../login.html";
      }, 2600);
    } else {
      console.error(res.error);
      Swal.fire({
        position: "top-end",
        icon: "error",
        title: `${res.error}`,
        showConfirmButton: false,
        timer: 2500,
      });
    }
  }).catch(error => {
    console.log(error);
  });
});
