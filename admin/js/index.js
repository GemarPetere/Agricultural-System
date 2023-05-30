import { sendGetRequest } from "./common.js";

const mapContainer = document.getElementById("map");
const totalFarmers = document.getElementById("totalFarmers");
const totalLandArea = document.getElementById("totalLandArea");
const currYear = new Date().getFullYear();
let totalCropsChart = $("#totalCrops").get(0).getContext("2d");
let farmerCoords = [];
let farmerMarkerDetails = [];
let tableData = [];
let map;
// Generate random background colors
const colors = ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"];
const backgroundColors = colors.map(() => {
  const r = Math.floor(Math.random() * 255);
  const g = Math.floor(Math.random() * 255);
  const b = Math.floor(Math.random() * 255);
  return `rgb(${r}, ${g}, ${b})`;
});

let totalCropsData = {
  labels: [],
  datasets: [
    {
      data: [],
      backgroundColor: backgroundColors,
    },
  ],
};

let chartOptions = {
  maintainAspectRatio: false,
  responsive: true,
  plugins: {
    colorschemes: {
      scheme: "office.Waveform6",
    },
  },
  legend: {
    position: 'right'
    // display: false, // Hide the legend
  },
};

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

  // console.log("Latitude: ", latitude);
  // console.log("Latitude: ", longitude);

  // console.log(`https://www.google.com/maps/@${latitude},${longitude},10z`);

  const coords = [6.951944838057917, 126.21625900268556];
  map = L.map("map").setView(coords, 13);

  for (let i = 0; i < farmerCoords.length; i++) {
    var marker = L.marker(farmerCoords[i][0]).addTo(map);
    marker.on("mouseover", function () {
      if (!this.isPopupOpen())
        this.bindTooltip(
          `<span><strong>Name:</strong> ${farmerCoords[i][1].Name}</span>
          <br><span><strong>Brgy:</strong> ${farmerCoords[i][1].Barangay}</span>
          <br><span><strong>Area:</strong> ${farmerCoords[i][1].LandArea}</span>`
        ).openTooltip();
    });
    // L.tooltip(farmerCoords[i], {
    //   parmanent: true,
    //   content: "Hello world!<br />This is a nice tooltip.",
    // }).addTo(map);
  }

  L.tileLayer("https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png", {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(map);
}

sendGetRequest("/search4/dashboard").then((res) => {
  if (res) {
    totalFarmers.innerText = res.farmerCount;
    totalLandArea.innerText = res.farmedArea;
    for (let i = 0; i < res.farmer.length; i++) {
      farmerCoords.push([
        [res.farmer[i].lat, res.farmer[i].long],
        {
          Name: res.farmer[i].firstName + " " + res.farmer[i].lastName,
          Barangay: res.farmer[i].barangay,
          LandArea: res.farmer[i].landArea,
        },
      ]);
    }
    console.log(farmerCoords);
    _getPosition();

    res.farmer.map((data) => {
      console.log(data);
      let newObj = {
        Name: `<img src="${data.image.secure_url}" width="26" height="26" class="rounded-circle"> ${data.firstName} ${data.lastName}`,
        Age: data.age,
        Contact: data.contactNo,
        Barangay: data.barangay,
      };
      tableData.push(newObj);
    });
    $("#farmer-table")
      .DataTable({
        data: tableData,
        searching: false,
        columns: [
          { data: "Name" },
          { data: "Age" },
          { data: "Contact" },
          { data: "Barangay" },
        ],
        responsive: true,
        bPaginate: false,
        lengthChange: false,
        autoWidth: false,
        buttons: ["copy", "csv", "excel", "pdf", "print"],
      })
      .buttons()
      .container()
      .appendTo("#example1_wrapper .col-md-6:eq(0)");
  }
});

sendGetRequest(`/search5/${currYear}`)
  .then((data) => {
    console.log(data);
document.getElementById("currentYear").innerText = currYear
    for (let [key, value] of Object.entries(data.body)) {
      totalCropsData.labels.push(key);
      totalCropsData.datasets[0].data.push(value);
      new Chart(totalCropsChart, {
        type: "pie",
        data: totalCropsData,
        options: chartOptions,
      });
    }
  })
  .catch((err) => {
    console.log(err);
  });
