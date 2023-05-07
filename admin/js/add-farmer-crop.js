import { sendGetRequest, sendPostRequest } from "./common.js";

$(function () {
  //Initialize Select2 Elements
  $(".select2").select2();

  //Initialize Select2 Elements
  $(".select2bs4").select2({
    theme: "bootstrap4",
  });
  //Datemask dd/mm/yyyy
  $("#datemask").inputmask("dd/mm/yyyy", { placeholder: "dd/mm/yyyy" });
  //Datemask2 mm/dd/yyyy
  $("#datemask2").inputmask("mm/dd/yyyy", { placeholder: "mm/dd/yyyy" });
  //Money Euro
  $("[data-mask]").inputmask();
});

let tableData = [];

sendGetRequest("/farmer/recruitement").then((res) => {
  res.map((data) => {
    console.log(data);
    const html = `<option value="${data.id}">${data.Name}</option>`;
    document.getElementById("default").insertAdjacentHTML("afterend", html);
  });
});

const addCropForm = document.getElementById("add-crop-form");

addCropForm.addEventListener("submit", function (e) {
  e.preventDefault();
  const newCrop = {
    farmerId: e.target.elements.listFarmers.value,
    year: e.target.elements.year.value,
    crop: e.target.elements.crop.value,
    landArea: e.target.elements.landArea.value,
    yield: e.target.elements.yield.value,
    netIncome: e.target.elements.netIncome.value,
    production: e.target.elements.netIncome.value,
  };
  console.log(newCrop);
  sendPostRequest(
    `/farmer/recruitement/farmer-crop/${e.target.elements.listFarmers.value}`,
    newCrop
  ).then((res) => {
    console.log(res);
  });
});
