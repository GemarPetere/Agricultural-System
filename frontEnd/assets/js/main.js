"use strict";

// Initialize header and footer components
window.addEventListener("load", function () {
  $(function () {
    $("#header").load("../components/header.html");
  });
  $(function () {
    $("#footer").load("components/footer.html");
  });
});
// Initialize Google Font
let font = document.createElement("link");
font.href =
  "https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800;900&display=swap";
font.rel = "stylesheet";
document.head.appendChild(font);
// Initialize Jquery
let jqueryScript = document.createElement("script");
jqueryScript.src = "https://code.jquery.com/jquery-3.6.3.min.js";
document.head.appendChild(jqueryScript);
// Initialize sweet alert
let sweetAlertScript = document.createElement("script");
sweetAlertScript.src = "https://cdn.jsdelivr.net/npm/sweetalert2@11";
sweetAlertScript.defer = true;
document.head.appendChild(sweetAlertScript);
