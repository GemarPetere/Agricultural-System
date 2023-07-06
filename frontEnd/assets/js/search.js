import { sendGetRequest } from "./common.js";

const url = window.location.href;
let searchItem;
let searchBy;
const searchYearContainer = document.getElementById("searchYear");
const currentYear = new Date().getFullYear();
let lastFiveyears = [];

const searchResultsContainer = document.getElementById("searchResults");
const searchForm = document.getElementById("searchForm");
const ctx = document.getElementById("searchChart");
let mapContainer = document.querySelector(".mapContainer");
let map;
// populate last 5 years array
for (let i = 0; i < 5; i++) {
  if (lastFiveyears.length == 0) {
    lastFiveyears.push(currentYear);
  } else {
    lastFiveyears.push(lastFiveyears.slice(-1) - 1);
  }
  searchYearContainer.insertAdjacentHTML(
    "afterbegin",
    `<option value="${lastFiveyears[i]}">${lastFiveyears[i]}</option>`
  );
}

let chartData = {
  labels: [],
  datasets: [
    {
      label: "",
      data: [],
      borderWidth: 1,
    },
  ],
};
let chart;

// Search from Url
if (url.includes("?q=")) {
  searchItem = url.slice(url.lastIndexOf("?q=") + 3, url.lastIndexOf("?type="));
  searchBy = url.slice(
    url.lastIndexOf("?type=") + 6,
    url.lastIndexOf("?year=")
  );
  const srchYear = url.slice(url.lastIndexOf("?year=") + 6);
  console.log(searchItem);
  console.log(searchBy);
  console.log(srchYear);
  search(searchItem, searchBy, srchYear);
}

function search(searchItem, searchBy, searchYear = searchYearContainer.value) {
  console.log(`/search2/${searchItem}/${searchYear}`);
  // Search by farmer
  if (searchBy == "farmer") {
    document.getElementById("searchChartContainer").style.display = "none";
    sendGetRequest(`/search2/${searchItem}/${searchYear}`).then((res) => {
      searchResultsContainer.innerHTML = "";
      console.log(res);
      if (res.length == 0) {
        searchResultsContainer.innerHTML = "";
        searchResultsContainer.insertAdjacentHTML(
          "afterbegin",
          `<h3 class="text-center py-5">No data was Found</h3>`
        );
      }
      let html;
      for (let i = 0; i < res.length; i++) {
        console.log(i);
        let date = new Date(res[i].farmer.updatedAt);
        html = `
        <a href="farmer.html?id=${res[i].farmer._id}">
        <div class="list-group-item mb-2" style="color:#000;">
                    <div class="row">
                      <div class="col-auto">
                        <img
                           width="160" height="160"
                          src="${res[i].farmer.image.secure_url}"
                          alt="${res[i].farmer.firstName} ${
          res[i].farmer.lastName
        }"
                        />
                      </div>
                      <div class="col px-4">
                        <div>
                          <div class="float-right"> ${date.toLocaleString()}</div>
                          <h3 class="mb-0">${res[i].farmer.firstName} ${
          res[i].farmer.lastName
        }</h3>
                        <p class="mb-0">${
                          res[i].farmer.email
                            ? `<strong>Email: </strong>${res[i].farmer.email}`
                            : ""
                        }</p>
                          <p class="mb-0">
                            <strong>Address:</strong> ${res[i].farmer.address}
                          </p>
                          <p class="mb-0">
                          <strong>Age:</strong> ${res[i].farmer.age}
                          </p>
                          <p class="mb-0">
                          <strong>Religion:</strong> ${res[i].farmer.religion}
                          </p>
                          <p class="mb-0">
                          <strong>Contact Number:</strong> ${
                            res[i].farmer.contactNo
                          }
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
        </a>
            `;
        searchResultsContainer.insertAdjacentHTML("afterbegin", html);
      }
    });
  }
  // Seach by Brgy
  if (searchBy == "barangay") {
    sendGetRequest(`/search3/${searchItem}/${searchYear}`).then((res) => {
      console.log(res);
      searchResultsContainer.innerHTML = "";
      if (res.length == 0) {
        document.getElementById("searchChartContainer").style.display = "none";

        searchResultsContainer.innerHTML = "";
        searchResultsContainer.insertAdjacentHTML(
          "afterbegin",
          `<h3 class="text-center py-5 text-white">No data was Found</h3>`
        );
      } else {
        document.getElementById("searchChartContainer").style.display = "block";
        mapContainer.innerHTML = "";
      }

      let html;
      chartData.datasets[0].label = "";
      chartData.datasets[0].data.length = 0;
      chartData.labels.length = 0;

      for (let i = 0; i < res.length; i++) {
        if (res[i].cropsDetails.length != 0) {
          chartData.datasets[0].label = `Crops in Brgy.${res[0].farmer.barangay}`;
          for (let index = 0; index < res[i].cropsDetails.length; index++) {
            chartData.datasets[0].data.push(
              res[i].cropsDetails[index].production
            );
            chartData.labels.push(res[i].cropsDetails[index].crop);
          }
        }
      }
      if (chart) {
        chart.destroy();
      }
      chart = new Chart(ctx, {
        type: "bar",
        data: chartData,
        options: {
          maintainAspectRatio: false,
          scales: {
            yAxes: [
              {
                ticks: {
                  beginAtZero: true,
                },
              },
            ],
          },
        },
      });
    });
  }
  // Search by Crop
  if (searchBy == "crop") {
    sendGetRequest(`/search/farmer/${searchItem}/${searchYear}`).then((res) => {
      searchResultsContainer.innerHTML = "";
      chartData.datasets[0].label = "";
      chartData.datasets[0].data.length = 0;
      console.log(res);
      chartData.labels.length = 0;
      if (!res.message) {
        for (let i = 0; i < res.farmData.length; i++) {
          chartData.datasets[0].label = `Barangay's with ${searchItem}`;
          chartData.datasets[0].data.push(res.farmData[i].production);
          chartData.labels.push(res.farmData[i].barangay);
        }
      }

      if (res.message) {
        document.getElementById("searchChartContainer").style.display = "none";
        mapContainer.innerHTML = "";
        searchResultsContainer.innerHTML = "";
        searchResultsContainer.insertAdjacentHTML(
          "afterbegin",
          `<h3 class="text-center py-5 text-white">No data was Found</h3>`
        );
      } else {
        document.getElementById("searchChartContainer").style.display = "block";
        mapContainer.innerHTML = "";
        mapContainer.innerHTML = `<div id='map' style='width: 100%; height: 100%;'></div>`;
        map = L.map("map");
        for (let i = 0; i < res.farmData.length; i++) {
          var marker = L.marker([res.farmData[i].lat, res.farmData[i].long]).addTo(map);
          marker.on("mouseover", function () {
            if (!this.isPopupOpen())
              this.bindTooltip(
                `<span><strong>Brgy:</strong> ${res.farmData[i].barangay}</span><br>
                <span><strong>Land Area:</strong> ${res.farmData[i].landArea}</span>`
              ).openTooltip();
          });
        }

        map.setView([6.9522, 126.2173], 13);

        L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        }).addTo(map);
      }
      let html;
      for (let i = 0; i < res.length; i++) {
        console.log(i);
        let date = new Date(res[i].farmers.updatedAt);
        html = `
            <a href="farmer.html?id=${res[i].farmers._id}">
            <div class="list-group-item mb-2" style="color:#000;">
                    <div class="row">
                      <div class="col-auto">
                        <img
                           width="160" height="160"
                          src="${res[i].farmers.image.secure_url}"
                          alt="${res[i].farmers.firstName} ${
          res[i].farmers.lastName
        }"
                        />
                      </div>
                      <div class="col px-4">
                        <div>
                          <div class="float-right"> ${date.toLocaleString()}</div>
                          <h3 class="mb-0">${res[i].farmers.firstName} ${
          res[i].farmers.lastName
        }</h3>
                        <p class="mb-0">${
                          res[i].farmers.email
                            ? `<strong>Email: </strong>${res[i].farmers.email}`
                            : ""
                        }</p>
                          <p class="mb-0">
                            <strong>Address:</strong> ${res[i].farmers.address}
                          </p>
                          <p class="mb-0">
                          <strong>Age:</strong> ${res[i].farmers.age}
                          </p>
                          <p class="mb-0">
                          <strong>Religion:</strong> ${res[i].farmers.religion}
                          </p>
                          <p class="mb-0">
                          <strong>Contact Number:</strong> ${
                            res[i].farmers.contactNo
                          }
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
            </a>
            `;
        // searchResultsContainer.insertAdjacentHTML("afterbegin", html);
      }
      if (chart) {
        chart.destroy();
      }
      chart = new Chart(ctx, {
        type: "bar",
        data: chartData,
        fillColor: getRandomColor(),
        options: {
          maintainAspectRatio: false,
          scales: {
            yAxes: [
              {
                ticks: {
                  beginAtZero: true,
                },
              },
            ],
          },
        },
      });
    });
  }
}

searchForm.addEventListener("submit", function (e) {
  e.preventDefault();
  const searchItem = e.target.elements.searchValue.value;
  const searchBy = e.target.searchBy.value;
  if (searchItem != "") {
    search(searchItem, searchBy, searchYearContainer.value);
  }
});

function getRandomColor() {
  var letters = "0123456789ABCDEF".split("");
  var color = "#";
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}
