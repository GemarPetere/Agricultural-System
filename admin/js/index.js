import { sendGetRequest } from "./common.js";

const mapContainer = document.getElementById("map");
const totalFarmers = document.getElementById("totalFarmers");
const totalLandArea = document.getElementById("totalLandArea");
let farmerCoords = [];
let tableData = [];
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

  console.log(`https://www.google.com/maps/@${latitude},${longitude},10z`);

  const coords = [6.951944838057917, 126.21625900268556];
  map = L.map("map").setView(coords, 13);

  for (let i = 0; i < farmerCoords.length; i++) {
    L.marker(farmerCoords[i]).addTo(map);
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
      farmerCoords.push([res.farmer[i].lat, res.farmer[i].long]);
    }
    console.log(farmerCoords);
    _getPosition();

    res.farmer.map((data) => {
      let newObj = {
        Name: `<img src="${data.image.secure_url}" width="26" class="rounded-circle"> ${data.firstName} ${data.lastName}`,
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

sendGetRequest("/farmer/recruitement").then((res) => {});
