import { sendGetRequest } from "./common.js";

const url = window.location.href;
const farmerId = url.slice(url.lastIndexOf("?id=") + 4);
const mapContainer = document.getElementById("farmerMap");
const addressField = document.getElementById("address");
let map;

$(window).on("load", function () {
  console.log(navigator.geolocation);
  sendGetRequest(`/farmer/recruitement/${farmerId}`).then((res) => {
    console.log(res[0]);
    _loadMap(res[0].lat, res[0].long);
  });
});

function _loadMap(lat, lng) {
  const latitude = lat;
  const longitude = lng;

  // console.log("Latitude: ", latitude);
  // console.log("Latitude: ", longitude);

  // console.log(`https://www.google.com/maps/@${latitude},${longitude},20z`);

  const coords = [latitude, longitude];
  map = L.map(mapContainer).setView(coords, 17);

  L.tileLayer("https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png").addTo(
    map
  );
  let markerOptions = {
    title: "Farmer Location",
    clickable: true,
  };
  let marker = new L.Marker(coords, markerOptions);
  marker.bindPopup("Farmer Location").openPopup();
  marker.addTo(map);
}
