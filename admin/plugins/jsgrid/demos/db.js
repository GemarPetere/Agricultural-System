(function () {
  var db = {
    loadData: function (filter) {
      return $.grep(this.clients, function (client) {
        return (
          (!filter.Name || client.Name.indexOf(filter.Name) > -1) &&
          (filter.Age === undefined || client.Age === filter.Age) &&
          (!filter.Address || client.Address.indexOf(filter.Address) > -1) &&
          (!filter.Country || client.Country === filter.Country) &&
          (filter.Married === undefined || client.Married === filter.Married)
        );
      });
    },

    insertItem: function (insertingClient) {
      this.clients.push(insertingClient);
    },

    updateItem: function (updatingClient) {},

    deleteItem: function (deletingClient) {
      var clientIndex = $.inArray(deletingClient, this.clients);
      this.clients.splice(clientIndex, 1);
    },
  };

  window.db = db;

  db.countries = [
    { Name: "", Id: 0 },
    { Name: "United States", Id: 1 },
    { Name: "Canada", Id: 2 },
    { Name: "United Kingdom", Id: 3 },
    { Name: "France", Id: 4 },
    { Name: "Brazil", Id: 5 },
    { Name: "China", Id: 6 },
    { Name: "Russia", Id: 7 },
  ];

  db.clients = [
    {
      Name: "Otto Clay",
      Age: 61,
      "Location (Coordinates)": "12344566",
      Crops: "Rice, Banana, Coconut",
      Area: "45 sqm",
      Yield: "Test",
      Status: "Active",
    },
    {
      Name: "Otto Clay",
      Age: 61,
      "Location (Coordinates)": "1231254652",
      Crops: "Rice, Banana, Coconut",
      Area: "500 sqm",
      Yield: "Test",
      Status: "Inactive",
    },
    {
      Name: "Otto Clay",
      Age: 61,
      "Location (Coordinates)": "1231254652",
      Crops: "Rice, Banana, Coconut",
      Area: "500 sqm",
      Yield: "Test",
      Status: "Inactive",
    },
    {
      Name: "Otto Clay",
      Age: 61,
      "Location (Coordinates)": "1231254652",
      Crops: "Rice, Banana, Coconut",
      Area: "500 sqm",
      Yield: "Test",
      Status: "Inactive",
    },
    {
      Name: "Otto Clay",
      Age: 61,
      "Location (Coordinates)": "1231254652",
      Crops: "Rice, Banana, Coconut",
      Area: "500 sqm",
      Yield: "Test",
      Status: "Inactive",
    },
    {
      Name: "Otto Clay",
      Age: 61,
      "Location (Coordinates)": "1231254652",
      Crops: "Rice, Banana, Coconut",
      Area: "500 sqm",
      Yield: "Test",
      Status: "Inactive",
    },
    {
      Name: "Otto Clay",
      Age: 61,
      "Location (Coordinates)": "1231254652",
      Crops: "Rice, Banana, Coconut",
      Area: "500 sqm",
      Yield: "Test",
      Status: "Inactive",
    },
    {
      Name: "Otto Clay",
      Age: 61,
      "Location (Coordinates)": "1231254652",
      Crops: "Rice, Banana, Coconut",
      Area: "500 sqm",
      Yield: "Test",
      Status: "Inactive",
    },
    {
      Name: "Otto Clay",
      Age: 61,
      "Location (Coordinates)": "1231254652",
      Crops: "Rice, Banana, Coconut",
      Area: "500 sqm",
      Yield: "Test",
      Status: "Inactive",
    },
    {
      Name: "Otto Clay",
      Age: 61,
      "Location (Coordinates)": "1231254652",
      Crops: "Rice, Banana, Coconut",
      Area: "500 sqm",
      Yield: "Test",
      Status: "Inactive",
    },
    {
      Name: "Otto Clay",
      Age: 61,
      "Location (Coordinates)": "1231254652",
      Crops: "Rice, Banana, Coconut",
      Area: "500 sqm",
      Yield: "Test",
      Status: "Inactive",
    },
  ];
})();
