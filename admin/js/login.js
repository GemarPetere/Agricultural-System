"use strict";

import { loginUser } from "./common.js";
import { checkLogin } from "./common.js";

const signupForm = document.getElementById("signupForm");
const isUserLoggedIn = localStorage.getItem("user-token");
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

if (checkLogin()) {
  window.location.href = "../admin/index.html";
}

loginForm.addEventListener("submit", function (e) {
  e.preventDefault();

  const route = "/auth/signin";

  const userInfo = {
    email: loginForm.elements["email"].value,
    password: loginForm.elements["password"].value,
  };

  loginUser(userInfo, route).then((res) => {
    console.log(res);

    if (res.token != "") {
      localStorage.setItem("userToken", res.token);
      localStorage.setItem("userID", res.user._id);
      localStorage.setItem("userName", res.user.name);
      localStorage.setItem("userEmail", res.user.email);
      localStorage.setItem("userRole", res.user.role);

      Toast.fire({
        icon: "success",
        title: "Sign in successfully",
      });

      setTimeout(() => {
        window.location.href = "../index.html";
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
  });
});
