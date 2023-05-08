import { sendGetRequest } from "./common.js";

const url = window.location.href;
const farmerId = url.slice(url.lastIndexOf("?id=") + 4);
const mapContainer = document.getElementById("farmerMap");
const addressField = document.getElementById("address");
let farmDataYear = new Date().getFullYear();
console.log(farmDataYear);
let map;

$(window).on("load", function () {
  // Get Farmer Details
  sendGetRequest(`/farmer/recruitement/${farmerId}`).then((res) => {
    console.log(res[0]);
    document.getElementById("farmerDetails").insertAdjacentHTML(
      "afterbegin",
      `
      <img
      src="${res[0].image.secure_url}"
      width="150"
      height="150"
      class="mr-4"
      alt=""
    />
      <div class="d-flex flex-column">
      <span style="font-size: 20px; font-weight: 500">
      <strong>Name:</strong> ${res[0].firstName} ${res[0].lastName} 
      </span>
      <span style="font-size: 20px; font-weight: 500">
        <strong>Age:</strong> ${res[0].age} years old
      </span>
      <span style="font-size: 20px; font-weight: 500">
        <strong>Location:</strong> ${res[0].address}
      </span>
      </div>
      `
    );
    // Get Farmer Crops Details
    sendGetRequest(
      `/farmer/recruitement/farmer-crop/${farmDataYear}/${res[0]._id}`
    ).then((crops) => {
      // Initialize Charts
      let landAreaChart = $("#donutChart2").get(0).getContext("2d");
      let yieldChart = $("#donutChart3").get(0).getContext("2d");
      let cropsLists = [];
      let landAreaData = {
        labels: [],
        datasets: [
          {
            data: [],
          },
        ],
      };
      let yieldData = {
        labels: [],
        datasets: [
          {
            data: [],
          },
        ],
      };
      for (let i = 0; i < crops.result.length; i++) {
        landAreaData.datasets[0].data.push(crops.result[i].landArea);
        landAreaData.labels.push(crops.result[i].crop);
        yieldData.datasets[0].data.push(crops.result[i].yield);
        yieldData.labels.push(crops.result[i].crop);
        cropsLists.push(crops.result[i].crop);
      }
      console.log(cropsLists.length);
      if (cropsLists.length == 0) {
        document.getElementById("listCrops").innerHTML =
          "<p class='text-center'>No Data</p>";
      } else {
        cropsLists.forEach((crop) => {
          document.getElementById("listCrops").insertAdjacentHTML(
            "afterbegin",
            `
          <li class="list-group-item justify-content-between">
            ${crop}
          </li>
          `
          );
        });
      }

      let pieChartOptions = {
        maintainAspectRatio: false,
        responsive: true,
        plugins: {
          colorschemes: {
            scheme: "office.Waveform6",
          },
        },
      };
      let barChartOptions = {
        maintainAspectRatio: false,
        responsive: true,
        plugins: {
          colorschemes: {
            scheme: "brewer.Paired3",
          },
        },
      };

      if (
        landAreaData.datasets[0].data.length == 0 &&
        yieldData.datasets[0].data.length == 0
      ) {
        document.getElementById("donutChart2").closest(".card-body").innerHTML =
          "<p class='text-center'>No Data</p>";
        document.getElementById("donutChart3").closest(".card-body").innerHTML =
          "<p class='text-center'>No Data</p>";
      } else {
        new Chart(landAreaChart, {
          type: "doughnut",
          data: landAreaData,
          options: pieChartOptions,
        });
        new Chart(yieldChart, {
          type: "doughnut",
          data: yieldData,
          options: barChartOptions,
        });
      }
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
  // let donutChartCanvas2 = $("#donutChart2").get(0).getContext("2d");
  let donutChartCanvas3 = $("#donutChart3").get(0).getContext("2d");
  let donutData = {
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

  // new Chart(donutChartCanvas3, {
  //   type: "doughnut",
  //   data: donutData,
  //   options: donutOptions,
  // });
});
