"use strict";

import { sendPostRequest } from "./common.js";

const signupForm = document.getElementById("signupForm");
const isUserLoggedIn = localStorage.getItem("userToken");
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

if (isUserLoggedIn) {
  window.location.href = "../admin/index.html";
}

signupForm.addEventListener("submit", function (e) {
  e.preventDefault();

  const route = "/auth/signup";

  const userInfo = {
    name:
      signupForm.elements["firstName"].value +
      " " +
      signupForm.elements["lastName"].value,
    email: signupForm.elements["email"].value,
    password: signupForm.elements["password"].value,
    address: "N/A",
  };

  sendPostRequest(route, userInfo)
    .then((res) => {
      if (res.message === "successfully signup") {
        Toast.fire({
          icon: "success",
          title: "Successfully Registered",
        });

        setTimeout(() => {
          window.location.href = "../login.html";
        }, 2600);
      } else {
        console.error(res.error);
        Toast.fire({
          icon: "error",
          title: res.error,
        });
      }
    })
    .catch((error) => {
      console.log(error);
    });
});
