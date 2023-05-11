import { sendGetRequest } from "./common.js";

let tableData = [];

sendGetRequest("/farmer/recruitement").then((res) => {
  res.map((data) => {
    let newObj = {
      Name: `<img src="${data.image}" width="26" class="rounded-circle"> ${data.Name}`,
      Age: data.Age,
      Contact: data.Contact,
      Edit: `<a class="btn btn-primary" href="farmer.html?id=${data.id}">View</a>`,
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
  });
