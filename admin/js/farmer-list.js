import { sendGetRequest, editFarmerStatus } from "./common.js";

let tableData = [];

sendGetRequest("/farmer/recruitement").then((res) => {
  console.log(res);
  res.map((data) => {
    let newObj = {
      Name: `<img src="${data.image}" width="26" height="26" class="rounded-circle"> ${data.Name}`,
      Age: data.Age,
      Contact: data.Contact,
      Status: `<div class="rounded py-1 text-center ${
        data.activeStatus ? "activeStatus" : "inactiveStatus"
      }" role="alert">${data.activeStatus ? "Active" : "Inactive"}</div>`,
      Edit: `<a class="btn btn-primary" style="margin-right:10px;" href="farmer.html?id=${
        data.id
      }">View</a>
      <a class="editStatusBtn btn btn-${
        data.activeStatus ? "danger" : "success"
      }"data-id="${data.id}" >${
        data.activeStatus ? "Deactivate" : "Activate"
      }</a>`,
    };
    console.log(data);
    tableData.push(newObj);
  });
  $("#farmer-table")
    .DataTable({
      data: tableData,
      columns: [
        { data: "Name" },
        { data: "Age" },
        { data: "Contact" },
        { data: "Status" },
        { data: "Edit" },
      ],
      responsive: true,
      lengthChange: false,
      autoWidth: false,
      buttons: ["copy", "csv", "excel", "pdf", "print"],
    })
    .buttons()
    .container()
    .appendTo("#example1_wrapper .col-md-6:eq(0)");
  const editStatusBtn = document.querySelectorAll(".editStatusBtn");
  editStatusBtn.forEach((btn) => {
    btn.addEventListener("click", function (e) {
      console.log(e.target.innerText);
      const userData = {
        method: "PUT",
        body: {
          action: e.target.innerText == "Activate" ? "Active" : "Inactive",
        },
      };

      editFarmerStatus(`/farmer/recruitement/farmer/${e.target.dataset.id}`, {
        action: e.target.innerText == "Activate" ? true : false,
      })
        .then((res) => {
          console.log(res);
          if (res && res.activeStatus != null) {
            location.reload();
          } else {
            console.error("could not update status!");
          }
        })
        .catch((err) => {
          console.log(err);
        });
    });
  });
});
