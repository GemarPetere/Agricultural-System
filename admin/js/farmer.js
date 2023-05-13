import { sendGetRequest } from "./common.js";

const addCropBtn = document.getElementById("add_crop-btn");
let map;
const url = window.location.href;
const farmerId = url.slice(url.lastIndexOf("?id=") + 4);
const mapContainer = document.getElementById("farmerMap");
const addressField = document.getElementById("address");
let cropsLists = [];
let defaultFarmDataYear = new Date().getFullYear().toString();
let listOfYears = [defaultFarmDataYear];
let cropingYears;
const colors = ["#ff0000", "#00ff00", "#0000ff", "#ffff00", "#ff00ff"];
let landAreaChart = $("#donutChart2").get(0).getContext("2d");
let yieldChart = $("#donutChart3").get(0).getContext("2d");
let netIncomeChart = $("#netIncomeChart").get(0).getContext("2d");
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
let netIncomeData = {
  labels: [],
  datasets: [
    {
      label: "Net Income",
      data: [],
      fill: false,
      backgroundColor: [
        "rgba(255, 99, 132 )",
        "rgba(255, 159, 64)",
        "rgba(255, 205, 86)",
        "rgba(75, 192, 192)",
        "rgba(54, 162, 235)",
        "rgba(153, 102, 255)",
        "rgba(201, 203, 207, 0.2)",
      ],
      borderColor: [
        "rgb(255, 99, 132)",
        "rgb(255, 159, 64)",
        "rgb(255, 205, 86)",
        "rgb(75, 192, 192)",
        "rgb(54, 162, 235)",
        "rgb(153, 102, 255)",
        "rgb(201, 203, 207)",
      ],
      tension: 0.1,
    },
  ],
};

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
      scheme: "office.Waveform6",
    },
  },
};
let lineChartOptions = {
  maintainAspectRatio: false,
  responsive: true,
  plugins: {
    colorschemes: {
      scheme: "office.Waveform6",
    },
  },
};
let areachart;
let yieldchart;
let incomeChart;

const initCharts = function () {
  areachart = new Chart(landAreaChart, {
    type: "doughnut",
    data: landAreaData,
    options: pieChartOptions,
  });
  yieldchart = new Chart(yieldChart, {
    type: "doughnut",
    data: yieldData,
    options: barChartOptions,
  });
  incomeChart = new Chart(netIncomeChart, {
    type: "bar",
    data: netIncomeData,
    options: lineChartOptions,
  });
};

$(function () {
  //Initialize Select2 Elements
  $(".select2bs4").select2({
    theme: "bootstrap4",
    minimumResultsForSearch: -1,
  });
});

$(window).on("load", function () {
  // Get Farmer Details
  sendGetRequest(`/farmer/recruitement/${farmerId}`).then((res) => {
    addCropBtn.href = `add-farmer-crop.html?id=${res[0]._id}`;

    // Show Farmer Details
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
    // Get croping years
    sendGetRequest(`/farmer/recruitement/farmer-crop/${res[0]._id}`).then(
      (res) => {
        res.forEach((res) => {
          listOfYears.push(res.year);
        });
        cropingYears = Array.from(new Set(listOfYears)).reverse();
        // Initialize Years dropdown start
        cropingYears.forEach((year) => {
          const html = `<option value="${year}" ${
            year == defaultFarmDataYear ? "selected" : ""
          }>${year}</option>`;
          document
            .getElementById("yearOfCroping")
            .insertAdjacentHTML("afterbegin", html);
        });
      }
    );

    const selectElement = $("#yearOfCroping");
    selectElement.on("change", function (event) {
      document.getElementById("listCrops").innerHTML = "";
      const selectedValue = event.target.value;
      sendGetRequest(
        `/farmer/recruitement/farmer-crop/${selectedValue}/${res[0]._id}`
      ).then((crops) => {
        cropsLists = [];
        // Initialize Charts
        reset();
        for (let i = 0; i < crops.result.length; i++) {
          landAreaData.datasets[0].data.push(crops.result[i].landArea);
          landAreaData.labels.push(crops.result[i].crop);
          yieldData.datasets[0].data.push(crops.result[i].yield);
          yieldData.labels.push(crops.result[i].crop);
          cropsLists.push(crops.result[i].crop);
          netIncomeData.datasets[0].data.push(crops.result[i].netIncome);
          netIncomeData.labels.push(crops.result[i].crop);
        }

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

        if (
          landAreaData.datasets[0].data.length == 0 &&
          yieldData.datasets[0].data.length == 0
        ) {
          document
            .getElementById("donutChart2")
            .closest(".card-body").innerHTML =
            "<p class='text-center'>No Data</p>";
          document
            .getElementById("donutChart3")
            .closest(".card-body").innerHTML =
            "<p class='text-center'>No Data</p>";
        } else {
          areachart.destroy();
          yieldchart.destroy();
          incomeChart.destroy();
          initCharts();
        }
      });
    });

    // Get Farmer Crops Details
    sendGetRequest(
      `/farmer/recruitement/farmer-crop/${defaultFarmDataYear}/${res[0]._id}`
    ).then((crops) => {
      reset();
      for (let i = 0; i < crops.result.length; i++) {
        landAreaData.datasets[0].data.push(crops.result[i].landArea);
        landAreaData.labels.push(crops.result[i].crop);
        yieldData.datasets[0].data.push(crops.result[i].yield);
        yieldData.labels.push(crops.result[i].crop);
        cropsLists.push(crops.result[i].crop);
        netIncomeData.datasets[0].data.push(crops.result[i].netIncome);
        netIncomeData.labels.push(crops.result[i].crop);
      }

      console.log(netIncomeData);

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

      if (
        landAreaData.datasets[0].data.length == 0 &&
        yieldData.datasets[0].data.length == 0
      ) {
        document.getElementById("donutChart2").closest(".card-body").innerHTML =
          "<p class='text-center'>No Data</p>";
        document.getElementById("donutChart3").closest(".card-body").innerHTML =
          "<p class='text-center'>No Data</p>";
      } else {
        initCharts();
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

function reset() {
  netIncomeData.labels = [];
  cropsLists = [];
  landAreaData.labels = [];
  landAreaData.datasets[0].data = [];
  yieldData.datasets[0].data = [];
  yieldData.labels = [];
  netIncomeData.datasets[0].data = [];
  netIncomeData.datasets[0].labels = [];
}
