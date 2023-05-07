import { sendGetRequest } from "./common.js";

const url = window.location.href;
const farmerId = url.slice(url.lastIndexOf("?id=") + 4);
const mapContainer = document.getElementById("farmerMap");
const addressField = document.getElementById("address");
let farmDataYear = new Date().getFullYear();
console.log(farmDataYear);
let map;

$(window).on("load", function () {
  sendGetRequest(`/farmer/recruitement/${farmerId}`).then((res) => {
    console.log(res[0]);
    sendGetRequest(
      `/farmer/recruitement/farmer-crop/${farmDataYear}/${res[0]._id}`
    ).then((crops) => {
      console.log(crops.result);
      var donutChartCanvas2 = $("#donutChart2").get(0).getContext("2d");
      var donutData = {
        labels: ["Chrome", "IE", "FireFox", "Safari", "Opera", "Navigator"],
        datasets: [
          {
            data: [700, 500, 400, 600, 300, 100],
            backgroundColor: [
              "#f56954",
              "#00a65a",
              "#f39c12",
              "#00c0ef",
              "#3c8dbc",
              "#d2d6de",
            ],
          },
        ],
      };
    });
    _loadMap(res[0].lat, res[0].long);
  });
});

function _loadMap(lat, lng) {
  const latitude = lat;
  const longitude = lng;

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

function loadCharts() {}

$(function () {
  // var donutChartCanvas2 = $("#donutChart2").get(0).getContext("2d");
  var donutChartCanvas3 = $("#donutChart3").get(0).getContext("2d");
  var donutData = {
    labels: ["Chrome", "IE", "FireFox", "Safari", "Opera", "Navigator"],
    datasets: [
      {
        data: [700, 500, 400, 600, 300, 100],
        backgroundColor: [
          "#f56954",
          "#00a65a",
          "#f39c12",
          "#00c0ef",
          "#3c8dbc",
          "#d2d6de",
        ],
      },
    ],
  };
  var donutOptions = {
    maintainAspectRatio: false,
    responsive: true,
  };
  new Chart(donutChartCanvas2, {
    type: "doughnut",
    data: donutData,
    options: donutOptions,
  });
  new Chart(donutChartCanvas3, {
    type: "doughnut",
    data: donutData,
    options: donutOptions,
  });
});
