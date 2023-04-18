import sendPostRequest, { sendPutRequest } from "../../assets/js/common.js";

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

//     // Initialize Map
//     mapboxgl.accessToken =
//       "pk.eyJ1IjoiYmVuamllYmVuIiwiYSI6ImNrNXQ1M3IyczBza2YzbnBib2VjbnRrNnQifQ.xhXbsTEg6vZmrjr27iSs3g";

//     let map = new mapboxgl.Map({
//       container: "map",
//       style: "mapbox://styles/mapbox/streets-v11",
//       center: [126.219766, 6.959205],
//       zoom: 15,
//       attributionControl: false,
//     });

//     // Add geolocate control to the map.
//     let geolocate = new mapboxgl.GeolocateControl({
//       positionOptions: {
//         enableHighAccuracy: true,
//       },
//       trackUserLocation: true,
//     });

//     map.addControl(geolocate);
//     geolocate.on("geolocate", function (event) {
//       // console.log('event fired: ', event);
//       // console.log('Coords: ', event.coords);
//       // console.log('Latitude', event.coords.latitude);
//       // console.log('Longitude', event.coords.longitude);
//       let coordinates = event.coords.longitude + "," + event.coords.latitude;
//       let lngLatValues = {
//         lng: event.coords.longitude,
//         lat: event.coords.latitude,
//       };

//       let url =
//         "https://api.mapbox.com/geocoding/v5/mapbox.places/" +
//         coordinates +
//         ".json?access_token=pk.eyJ1IjoiYmVuamllYmVuIiwiYSI6ImNrNXQ1M3IyczBza2YzbnBib2VjbnRrNnQifQ.xhXbsTEg6vZmrjr27iSs3g";
//       let xmlHttp = new XMLHttpRequest();
//       xmlHttp.open("GET", url, false); // false for synchronous request
//       xmlHttp.send(null);
//       let result = JSON.parse(xmlHttp.responseText);

//       let r = result.features[1].place_name;
//       if (document.getElementById("address").value == "") {
//         marker1 = new mapboxgl.Marker().setLngLat(lngLatValues).addTo(map);
//         document.getElementById("address").value = "[" + coordinates + "]";
//         document.getElementById("coordinatesPin").innerHTML =
//           ":<strong>" + r + "</strong>";
//         document.getElementById("location").value = r;
//       } else {
//         marker1.remove();
//         marker1 = new mapboxgl.Marker().setLngLat(lngLatValues).addTo(map);
//         document.getElementById("address").value = "[" + coordinates + "]";
//         document.getElementById("coordinatesPin").innerHTML =
//           ":<strong>" + r + "</strong>";
//         document.getElementById("location").value = r;
//       }
//     });

//     let marker1;
//     map.on("click", function (e) {
//       let t = JSON.stringify(e.lngLat.wrap());
//       let u = JSON.parse(t);
//       let coordinates = u["lng"] + "," + u["lat"];
//       let url =
//         "https://api.mapbox.com/geocoding/v5/mapbox.places/" +
//         coordinates +
//         ".json?access_token=pk.eyJ1IjoiYmVuamllYmVuIiwiYSI6ImNrNXQ1M3IyczBza2YzbnBib2VjbnRrNnQifQ.xhXbsTEg6vZmrjr27iSs3g";

//       let xmlHttp = new XMLHttpRequest();
//       xmlHttp.open("GET", url, false); // false for synchronous request
//       xmlHttp.send(null);
//       let result = JSON.parse(xmlHttp.responseText);
//       // let r=result.features[1].place_name.replace(/\d+|^\s+|\s+$/g,'');
//       // let r = result.features[1].place_name;
//       // if (document.getElementById("address").value == "") {
//       //   marker1 = new mapboxgl.Marker().setLngLat(e.lngLat).addTo(map);
//       //   document.getElementById("address").value = e.lngLat;
//       //   document.getElementById("coordinatesPin").innerHTML =
//       //     ":<strong>" + r + "</strong>";
//       //   document.getElementById("location").value = r;
//       // } else {
//       //   marker1.remove();
//       //   marker1 = new mapboxgl.Marker().setLngLat(e.lngLat).addTo(map);
//       //   document.getElementById("address").value = e.lngLat;
//       //   document.getElementById("coordinatesPin").innerHTML =
//       //     ":<strong>" + r + "</strong>";
//       //   document.getElementById("location").value = r;
//       // }
//     });

//     /*
//   Create a popup, specify its options
//   and properties, and add it to the map.
// */
//     const popup = new mapboxgl.Popup({ offset: [0, -15] })
//       .setLngLat(feature.geometry.coordinates)
//       .setHTML(
//         `<h3>${feature.properties.title}</h3><p>${feature.properties.description}</p>`
//       )
//       .addTo(map);

//     /*
// Add an event listener that runs
// when a user clicks on the map element.
// */
//     map.on("click", (event) => {
//       // If the user clicked on one of your markers, get its information.
//       const features = map.queryRenderedFeatures(event.point, {
//         layers: ["YOUR_LAYER_NAME"], // replace with your layer name
//       });
//       if (!features.length) {
//         return;
//       }
//       const feature = features[0];

//       // Code from the next step will go here.
//     });
/* 
const recruitForm = document.getElementById("recruitForm");
const submitBtn = document.querySelector("button[value=submitBtn]");
const imageInput = document.getElementById("image");
// let formData = {};

recruitForm.addEventListener("submit", (e) => {
  e.preventDefault();

  let formData = new FormData(recruitForm);

 /*  //formData.append("image", imageInput.files[0]);
  for (const [key, value] of formData) {
    console.log(`${key}: ${value}`);
  } 
  formData.append('first-name', 'gemar')
  console.log(formData)

  sendPostRequest("/farmer/recruitement", formData).then((res) => {
    console.log(res);
  });
});*/
const form = document.querySelector("#recruitForm");
if (form) {
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    const obj = {
      firstName: recruitForm.elements["first-name"].value,
      middleName: recruitForm.elements["middleInitial"].value,
      lastName: recruitForm.elements["last-name"].value,
      suffix: recruitForm.elements["suffix"].value,
      address: recruitForm.elements["address"].value,
      birthDate: recruitForm.elements["date"].value,
      age: recruitForm.elements["age"].value,
      gender: recruitForm.elements["gender"].value,
      status: recruitForm.elements["civil-status"].value,
      religion: recruitForm.elements["religion"].value,
      contactNo: recruitForm.elements["contact-number"].value,
      landArea: recruitForm.elements["land-area"].value,
    };

    /*  const json = JSON.stringify(obj);
  const blob = new Blob([json], {
    type: 'application/json'
  });
 */
    const file = document.querySelector("#image");
    const formData = {
      firstName: recruitForm.elements["first-name"].value,
      middleName: recruitForm.elements["middleInitial"].value,
      lastName: recruitForm.elements["last-name"].value,
      suffix: recruitForm.elements["suffix"].value,
      address: recruitForm.elements["address"].value,
      birthDate: recruitForm.elements["date"].value,
      age: recruitForm.elements["age"].value,
      gender: recruitForm.elements["gender"].value,
      status: recruitForm.elements["civil-status"].value,
      religion: recruitForm.elements["religion"].value,
      contactNo: recruitForm.elements["contact-number"].value,
      landArea: recruitForm.elements["land-area"].value,
    };
    console.log(formData);

    sendPostRequest("/farmer/recruitement", formData)
      .then((res) => {
        console.log(res.data._id);
        sendPutRequest(`/farmer/recruitement/image/${res.data._id}`, {
          image: file.files[0],
        });
      })
      .catch((err) => {
        console.error(err);
      });
  });
} else {
  console.log("wala");
}
