import { sendPostRequest, sendPutRequest } from "./common.js";

const mapContainer = document.getElementById("map");
const addressField = document.getElementById("address");
let map;

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

const form = document.querySelector("#recruitForm");
const address = document.getElementById("address");
let formLat;
let formLng;
let barangay;

form.addEventListener("submit", function (e) {
  e.preventDefault();

  if (address.value == "") {
    console.log("Address empty");
  } else if (formLat == "") {
    console.log("Latitude is empty");
  } else if (formLng == "") {
    console.log("Longitude is empty");
  } else {
    let file = document.querySelector("input[type='file']");
    const refNum =
      recruitForm.elements["refYear"].value +
      "-" +
      recruitForm.elements["refMunCode"].value +
      "-" +
      recruitForm.elements["refBrgyCode"].value +
      "-" +
      recruitForm.elements["refConNum"].value;
    const formData = {
      refConNum: refNum,
      firstName: recruitForm.elements["first-name"].value,
      middleName: recruitForm.elements["middleInitial"].value,
      lastName: recruitForm.elements["last-name"].value,
      suffix: recruitForm.elements["suffix"].value,
      address: recruitForm.elements["address"].value,
      barangay: barangay,
      birthDate: recruitForm.elements["dateOfBirth"].value,
      email: recruitForm.elements["email"].value,
      age: recruitForm.elements["age"].value,
      gender: recruitForm.elements["gender"].value,
      status: recruitForm.elements["civil-status"].value,
      religion: recruitForm.elements["religion"].value,
      contactNo: recruitForm.elements["contact-number"].value,
      highestEducation: recruitForm.elements["highestEducation"].value,
      landArea: recruitForm.elements["land-area"].value,
      lat: `${formLat}`,
      long: `${formLng}`,
    };
    console.log(formData);

    sendPostRequest("/farmer/recruitement", formData)
      .then((res) => {
        console.log(res.data._id);
        let imageFile = file.files[0];

        console.log(imageFile);

        const imageData = new FormData();
        imageData.append("image", imageFile);

        sendPutRequest(
          `/farmer/recruitement/image/${res.data._id}`,
          imageData
        ).then((res) => {
          console.log(res);
          if (res.body.ok) {
            recruitForm.elements["refYear"].value = "";
            recruitForm.elements["refMunCode"].value = "";
            recruitForm.elements["refBrgyCode"].value = "";
            recruitForm.elements["refConNum"].value = "";
            recruitForm.elements["first-name"].value = "";
            recruitForm.elements["middleInitial"].value = "";
            recruitForm.elements["last-name"].value = "";
            (recruitForm.elements["suffix"].value = ""),
              (recruitForm.elements["address"].value = "");
            (recruitForm.elements["dateOfBirth"].value = ""),
              (recruitForm.elements["email"].value = "");
            recruitForm.elements["age"].value = "";
            recruitForm.elements["gender"].value = "";
            recruitForm.elements["civil-status"].value = "";
            recruitForm.elements["religion"].value = "";
            recruitForm.elements["contact-number"].value = "";
            recruitForm.elements["highestEducation"].value = "";
            recruitForm.elements["land-area"].value = "";
          } else {
            console.log("Unsuccessful");
          }
        });
      })
      .catch((err) => {
        console.error(err);
      });
  }
});
