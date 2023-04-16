"use strict";

import { loginUser } from "./common.js";
import { checkLogin } from "./common.js";

const signupForm = document.getElementById("signupForm");
const isUserLoggedIn = localStorage.getItem("user-token");

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

      alert("Successfuly signed in")

      setTimeout(() => {
        window.location.href = "../admin/index.html";
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
