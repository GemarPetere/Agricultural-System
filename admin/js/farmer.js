import { sendGetRequest } from "./common.js";

const addCropBtn = document.getElementById("add_crop-btn");
const addFarmBtn = document.getElementById("add_farm-btn");
const url = window.location.href;
const farmerId = url.slice(url.lastIndexOf("?id=") + 4);
const mapContainer = document.getElementById("farmerMap");
const addressField = document.getElementById("address");
const selectFarm = document.getElementById("listOfFarms");

let cropsLists = [];
let defaultFarmDataYear = new Date().getFullYear().toString();
let listOfYears = [defaultFarmDataYear];
let cropingYears;
const colors = ["#ff0000", "#00ff00", "#0000ff", "#ffff00", "#ff00ff"];
let landAreaChartContainer = $("#donutChart2").get(0).getContext("2d");
let yieldChartContainer = $("#donutChart3").get(0).getContext("2d");
let netIncomeChartContainer = $("#netIncomeChart").get(0).getContext("2d");
let farmDatas = {};
let currentfarm;
let map;
let farmyear;

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
  scales: {
    yAxes: [
      {
        ticks: {
          beginAtZero: true,
        },
      },
    ],
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
  scales: {
    yAxes: [
      {
        ticks: {
          beginAtZero: true,
        },
      },
    ],
  },
};
let areachart;
let yieldchart;
let incomeChart;

const initCharts = function () {
  if (areachart && yieldchart && incomeChart) {
    areachart.destroy();
    yieldchart.destroy();
    incomeChart.destroy();
    areachart = new Chart(landAreaChartContainer, {
      type: "doughnut",
      data: landAreaData,
      options: pieChartOptions,
    });
    yieldchart = new Chart(yieldChartContainer, {
      type: "doughnut",
      data: yieldData,
      options: pieChartOptions,
    });
    incomeChart = new Chart(netIncomeChartContainer, {
      type: "bar",
      data: netIncomeData,
      options: lineChartOptions,
    });
  } else {
    areachart = new Chart(landAreaChartContainer, {
      type: "doughnut",
      data: landAreaData,
      options: pieChartOptions,
    });
    yieldchart = new Chart(yieldChartContainer, {
      type: "doughnut",
      data: yieldData,
      options: pieChartOptions,
    });
    incomeChart = new Chart(netIncomeChartContainer, {
      type: "bar",
      data: netIncomeData,
      options: lineChartOptions,
    });
  }
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
  (async function () {
    try {
      sendGetRequest(`/farmer/recruitement/${farmerId}`).then((res) => {
        console.log(res);
        if (res.farm) {
          res.farm.forEach((data) => {
            farmDatas[data.barangay] = data._id;
          });
        }

        currentfarm = farmDatas[Object.keys(farmDatas)[0]];

        for (const key in farmDatas) {
          if (farmDatas.hasOwnProperty(key)) {
            const html = `<option value="${farmDatas[key]}">${key}</option>`;
            selectFarm.insertAdjacentHTML("afterbegin", html);
          }
        }

        if (res.crop) {
          res.crop.forEach((year) => {
            listOfYears.push(year);
          });
        }

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

        farmyear = document.getElementById("yearOfCroping").value;
        addCropBtn.href = `add-farmer-crop.html?id=${res.farmer[0]._id}`;
        addFarmBtn.href = `add-farm.html?id=${res.farmer[0]._id}`;
        // Show Farmer Details
        if (res.farmer && res.farm) {
          document.getElementById("farmerDetails").insertAdjacentHTML(
            "afterbegin",
            `
            <img
            src="${res.farmer[0].image.secure_url}"
            width="150"
            height="150"
            class="mr-4"
            alt=""
          />
            <div class="d-flex flex-column">
            <span style="font-size: 20px; font-weight: 500">
            <strong>Name:</strong> ${res.farmer[0].firstName} ${res.farmer[0].lastName} 
            </span>
            <span style="font-size: 20px; font-weight: 500">
              <strong>Age:</strong> ${res.farmer[0].age} years old
            </span>
            <span style="font-size: 20px; font-weight: 500">
              <strong>Location:</strong> ${res.farm[0].address}
            </span>
            </div>
            `
          );
        }
        console.log(farmyear, res.farmer[0]._id, currentfarm);
        getFarmerCrops(farmyear, res.farmer[0]._id, currentfarm);

        _loadMap(res);
      });
    } catch (err) {
      console.log(err);
    }
  })();
});

function _loadMap(res) {
  console.log(res);
  map = L.map(mapContainer).setView([res.farm[0].lat,res.farm[0].long], 13);
  let markerOptions;

  res.farm.forEach((farm) => {
    const { lat, long } = farm;
    console.log([lat, long]);
    markerOptions  = {
      title: farm.barangaysa,
      clickable: true,
    };
    new L.Marker([lat, long], markerOptions).addTo(map);
  });

  L.tileLayer("https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png").addTo(
    map
  );
}

function reset() {
  document.getElementById("listCrops").innerHTML = "";
  netIncomeData.labels = [];
  cropsLists = [];
  landAreaData.labels = [];
  landAreaData.datasets[0].data = [];
  yieldData.datasets[0].data = [];
  yieldData.labels = [];
  netIncomeData.datasets[0].data = [];
  netIncomeData.datasets[0].labels = [];
}

const getFarmerCrops = function (year = new Date().getFullYear(), id, farm) {
  console.log(`/farmer/recruitement/farmer-crop/${year}/${id}/${farm}`);
  // Get Farmer Crops Details
  sendGetRequest(`/farmer/recruitement/farmer-crop/${year}/${id}/${farm}`)
    .then((crops) => {
      console.log(crops);
      if (!crops.result.length <= 0) {
        cropsLists = [];
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
        document.querySelectorAll(".error_msg").forEach((err_msg) => {
          err_msg.style.display = "none";
        });
        document.getElementById("donutChart2").style.display = "block";
        document.getElementById("donutChart3").style.display = "block";
        initCharts();
      } else {
        document.getElementById("listCrops").innerHTML =
          "<p class='text-center'>No Data</p>";
        document.getElementById("donutChart2").style.display = "none";
        document.getElementById("donutChart3").style.display = "none";
        document.querySelectorAll(".error_msg").forEach((err_msg) => {
          err_msg.style.display = "block";
        });
      }
    })
    .catch((err) => {
      console.log(err);
    });
};

document.getElementById("sortbyBtn").addEventListener("click", function () {
  farmyear = document.getElementById("yearOfCroping").value;
  getFarmerCrops(farmyear, farmerId, selectFarm.value);
  incomeChart.destroy();
});
