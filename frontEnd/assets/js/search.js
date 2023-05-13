import { sendGetRequest } from "./common.js";

const url = window.location.href;
let searchItem;
const searchResultsContainer = document.getElementById("searchResults");
const searchForm = document.getElementById("searchForm");

console.log("Url: ", url);

function search(searchItem) {
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

// Search from Url
if (url.includes("?q=")) {
  searchItem = url.slice(url.lastIndexOf("?q=") + 3);
  console.log(searchItem);
  search(searchItem);
}

searchForm.addEventListener("submit", function (e) {
  e.preventDefault();
  const searchItem = e.target.elements.searchValue.value;
  console.log(searchItem);
  if (searchItem != "") search(e.target.elements.searchValue.value);
});
