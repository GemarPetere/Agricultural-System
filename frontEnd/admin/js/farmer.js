import { sendGetRequest } from "../../assets/js/common.js";

const url = window.location.href;
const farmerId = url.slice(url.lastIndexOf("?id=") + 4);

$(window).on("load", function () {
  sendGetRequest(`/farmer/recruitement/${farmerId}`).then((res) => {
    console.log(res[0]);
    document.getElementById("name").innerText =
      res[0].firstName + " " + res[0].lastName;
  });
});
