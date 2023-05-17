import { sendGetRequest } from "./common.js";

const url = window.location.href;
let searchItem;
let searchBy;
const searchResultsContainer = document.getElementById("searchResults");
const searchForm = document.getElementById("searchForm");
const ctx = document.getElementById("searchChart");
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

console.log("Url: ", url);

function search(searchItem, searchBy) {
  // Search by farmer
  if (searchBy == "farmer") {
    document.getElementById("searchChartContainer").style.display = "none";
    sendGetRequest(`/search2/${searchItem}`).then((res) => {
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
            <div class="list-group-item mb-2">
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
            `;
        searchResultsContainer.insertAdjacentHTML("afterbegin", html);
      }
    });
  }
  // Seach by Brgy
  if (searchBy == "barangay") {
    console.log(searchBy);
    sendGetRequest(`/search3/${searchItem}`).then((res) => {
      searchResultsContainer.innerHTML = "";
      console.log(res);
      if (res.length == 0) {
        document.getElementById("searchChartContainer").style.display = "none";

        searchResultsContainer.innerHTML = "";
        searchResultsContainer.insertAdjacentHTML(
          "afterbegin",
          `<h3 class="text-center py-5">No data was Found</h3>`
        );
      } else {
        document.getElementById("searchChartContainer").style.display = "block";
      }

      let html;
      chartData.datasets[0].label = "";
      chartData.datasets[0].data.length = 0;
      chartData.labels.length = 0;
      for (let i = 0; i < res.length; i++) {
        console.log(i);
        chartData.datasets[0].label = `Crops in Brgy.${res[0].farmer.barangay}`;
        chartData.datasets[0].data.push(res[i].cropsDetails[0].production);
        chartData.labels.push(res[i].cropsDetails[0].crop);
        let date = new Date(res[i].farmer.updatedAt);
        html = `
            <div class="list-group-item mb-2">
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
            `;
        searchResultsContainer.insertAdjacentHTML("afterbegin", html);
      }
      console.log(chartData);
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
            y: {
              beginAtZero: true,
            },
          },
        },
      });
    });
  }
  // Search by Crop
  if (searchBy == "crop") {
    sendGetRequest(`/search/farmer/${searchItem}`).then((res) => {
      searchResultsContainer.innerHTML = "";
      chartData.datasets[0].label = "";
      chartData.datasets[0].data.length = 0;
      console.log(res);
      chartData.labels.length = 0;
      for (let i = 0; i < res.length; i++) {
        chartData.datasets[0].label = `Barangay's with ${res[0].crop.crop}`;
        chartData.datasets[0].data.push(res[i].crop.production);
        chartData.labels.push(res[0].farmers.barangay);
      }
      if (res.length == 0) {
        document.getElementById("searchChartContainer").style.display = "none";

        searchResultsContainer.innerHTML = "";
        searchResultsContainer.insertAdjacentHTML(
          "afterbegin",
          `<h3 class="text-center py-5">No data was Found</h3>`
        );
      } else {
        document.getElementById("searchChartContainer").style.display = "block";
      }
      let html;
      for (let i = 0; i < res.length; i++) {
        console.log(i);
        let date = new Date(res[i].farmers.updatedAt);
        html = `
            <div class="list-group-item mb-2">
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
            `;
        searchResultsContainer.insertAdjacentHTML("afterbegin", html);
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
            y: {
              beginAtZero: true,
            },
          },
        },
      });
    });
  }
}

// Search from Url
if (url.includes("?q=")) {
  searchItem = url.slice(url.lastIndexOf("?q=") + 3, url.lastIndexOf("?type="));
  searchBy = url.slice(url.lastIndexOf("?type=") + 6);
  search(searchItem, searchBy);
}

searchForm.addEventListener("submit", function (e) {
  e.preventDefault();
  const searchItem = e.target.elements.searchValue.value;
  const searchBy = e.target.searchBy.value;
  if (searchItem != "") {
    search(searchItem, searchBy);
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
