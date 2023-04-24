import { sendGetRequest } from "../../assets/js/common.js";

let tableData = [];

sendGetRequest("/farmer/recruitement").then((res) => {
  res.map((data) => {
    let newObj = {
      Name: `<img src="${data.image}" width="26" class="rounded-circle"> ${data.Name}`,
      Age: data.Age,
      Contact: data.Contact,
    };
    tableData.push(newObj);
  });
  $(function () {
    $("#farmer-table")
      .DataTable({
        data: tableData,
        columns: [{ data: "Name" }, { data: "Age" }, { data: "Contact" }],
        responsive: true,
        lengthChange: false,
        autoWidth: false,
        buttons: ["copy", "csv", "excel", "pdf", "print"],
      })
      .buttons()
      .container()
      .appendTo("#example1_wrapper .col-md-6:eq(0)");
  });
});
