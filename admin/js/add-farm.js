import { sendGetRequest, sendPostRequest } from "./common.js";

const mapContainer = document.getElementById("map");
const addressField = document.getElementById("newFarmAddress");
const form = document.getElementById("add-farm-form");

let map;
let formLat;
let formLng;
let barangay;

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
  timer: 3000,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.addEventListener("mouseenter", Swal.stopTimer);
    toast.addEventListener("mouseleave", Swal.resumeTimer);
  },
});

function _getPosition() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(_loadMap.bind(this), function () {
      alert("Could not get your position");
    });
  }
}

function _loadMap(position) {
  const { latitude } = position.coords;
  const { longitude } = position.coords;

  console.log("Latitude: ", latitude);
  console.log("Latitude: ", longitude);

  console.log(`https://www.google.com/maps/@${latitude},${longitude},20z`);

  const coords = [6.951944838057917, 126.21625900268556];
  map = L.map("map").setView(coords, 13);

  L.tileLayer("https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png", {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(map);

  map.on("click", function (e) {
    console.log(e);
    const { lat, lng } = e.latlng;
    formLat = lat;
    formLng = lng;
    $.get(
      `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`,
      function (data) {
        console.log(data);
        addressField.value = data.display_name;
        barangay = data.address.village;
      }
    );
  });
}

_getPosition();

$(function () {
  //Initialize Select2 Elements
  $(".select2bs4").select2({
    theme: "bootstrap4",
    minimumResultsForSearch: Infinity,
  });
  //Datemask dd/mm/yyyy
  $("#datemask").inputmask("dd/mm/yyyy", { placeholder: "dd/mm/yyyy" });
  //Datemask2 mm/dd/yyyy
  $("#datemask2").inputmask("mm/dd/yyyy", { placeholder: "mm/dd/yyyy" });
  //Money Euro
  $("[data-mask]").inputmask();
});

if (farmerId == "") {
  sendGetRequest("/farmer/recruitement").then((res) => {
    res.map((data) => {
      console.log(data);
      const html = `<option value="${data.id}">${data.Name}</option>`;
      document
        .getElementById("listFarmers")
        .insertAdjacentHTML("afterbegin", html);
    });
  });
} else {
  sendGetRequest(`/farmer/recruitement/${farmerId}`).then((res) => {
    console.log(res);
    const html = `<option value="${res.farmer[0]._id}">${res.farmer[0].firstName} ${res.farmer[0].lastName}</option>`;
    document
      .getElementById("listFarmers")
      .insertAdjacentHTML("afterbegin", html);
  });
}



form.addEventListener("submit", function (e) {
  e.preventDefault();
  const newFarm = {
    address: addressField.value,
    barangay: barangay,
    landArea: document.getElementById("landArea").value,
    farmerId: farmerId,
    lat: formLat,
    long: formLng,
  };
  console.log(newFarm);
  sendPostRequest("/farmer/recruitement", newFarm).then(() => {
    Toast.fire({
      position: "top-end",
      icon: "success",
      title: `Farm added!`,
      showConfirmButton: false,
      timer: 2500,
    });
  });
});
