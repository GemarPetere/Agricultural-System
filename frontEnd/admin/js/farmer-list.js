let data = [
  {
    name: "Tiger Nixon",
    position: "System Architect",
    salary: "$3,120",
    start_date: "2011/04/25",
    office: "Edinburgh",
    extn: "5421",
  },
  {
    name: "Garrett Winters",
    position: "Director",
    salary: "$5,300",
    start_date: "2011/07/25",
    office: "Edinburgh",
    extn: "8422",
  },
];

$(function () {
  $("#farmer-table")
    .DataTable({
      data: data,
      columns: [
        { data: "name" },
        { data: "position" },
        { data: "salary" },
        { data: "office" },
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
