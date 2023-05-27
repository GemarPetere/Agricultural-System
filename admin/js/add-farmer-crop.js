import { sendGetRequest, sendPostRequest } from "./common.js";

const url = window.location.href;
let farmerId = "";
if (url.includes("?id=")) {
  farmerId = url.slice(url.lastIndexOf("?id=") + 4);
  console.log(farmerId);
}

const Toast = Swal.mixin({
  toast: true,
  position: "top-end",
  showConfirmButton: false,
  timer: 1000,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.addEventListener("mouseenter", Swal.stopTimer);
    toast.addEventListener("mouseleave", Swal.resumeTimer);
  },
});

const selectFields = document.querySelector(".select2-search__field");
const availableCrops = [
  "Rice",
  "Corn",
  "Cacao",
  "Coffee",
  "Vegetables",
  "Chili",
  "Rubber",
  "Falcata",
  "Banana",
  "Palm Oil",
];
const cropsSelectField = document.getElementById("crop");

availableCrops.reverse().forEach((crop) => {
  const html = `<option value="${crop}" ${
    crop == "Rice" ? "selected='true'" : ""
  }>${crop}</option>`;
  cropsSelectField.insertAdjacentHTML("afterbegin", html);
});

$(function () {
  //Initialize Select2 Elements

  //Initialize Select2 Elements
  $(".select2bs4").select2({
    theme: "bootstrap4",
    tags: true,
    createTag: function (params) {
      return {
        id: params.term,
        text: params.term,
        newOption: true,
      };
    },
  });

  //Datemask dd/mm/yyyy
  $("#datemask").inputmask("dd/mm/yyyy", { placeholder: "dd/mm/yyyy" });
  //Datemask2 mm/dd/yyyy
  $("#datemask2").inputmask("mm/dd/yyyy", { placeholder: "mm/dd/yyyy" });
  //Money Euro
  $("[data-mask]").inputmask();
});

let tableData = [];

if (farmerId == "") {
  sendGetRequest("/farmer/recruitement").then((res) => {
    res.map((data) => {
      console.log(data);
      const html = `<option value="${data.id}">${data.Name}</option>`;
      document.getElementById("listFarmers").insertAdjacentHTML("afterbegin", html);
    });
  });
} else {
  sendGetRequest(`/farmer/recruitement/${farmerId}`).then((res) => {
    res.map((data) => {
      console.log(data);
      const html = `<option value="${data._id}">${data.firstName} ${data.lastName}</option>`;
      document
        .getElementById("listFarmers")
        .insertAdjacentHTML("afterbegin", html);
    });
  });
}

const addCropForm = document.getElementById("add-crop-form");

addCropForm.addEventListener("submit", function (e) {
  e.preventDefault();
  const newCrop = {
    farmerId: e.target.elements.listFarmers.value || farmerId,
    year: e.target.elements.year.value,
    crop: e.target.elements.crop.value,
    landArea: e.target.elements.landArea.value,
    yield: e.target.elements.yield.value,
    netIncome: e.target.elements.netIncome.value,
    production: e.target.elements.production.value,
  };
  console.log(newCrop);
  sendPostRequest(
    `/farmer/recruitement/farmer-crop/${
      e.target.elements.listFarmers.value || farmerId
    }`,
    newCrop
  )
    .then((res) => {
      if (res.data) {
        Toast.fire({
          icon: "success",
          title: "Crop added successfully",
        });
        setTimeout(() => {
          location.reload();
        }, 1100);
      }
    })
    .catch((err) => {
      Toast.fire({
        icon: "success",
        title: err.error,
      });
    });
});
