"use strict";

// Initialize Home Page Map
const mapContainer = document.getElementById("map");
const loaderContainer = document.getElementById("loader");
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

  const coords = [latitude, longitude];
  map = L.map("map");
  map.on("load", function (e) {
    loaderContainer.classList.add("hidden");
  });
  map.setView(coords, 13);

  L.tileLayer("https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png").addTo(
    map
  );
}

_getPosition();
