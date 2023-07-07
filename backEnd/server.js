const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
const expressValidator = require("express-validator");
const cookieParser = require("cookie-parser");
const fileUpload = require('express-fileupload');
const cors = require("cors");
const path = require("path");
const sockets = require("./sockets");
require("dotenv").config();


// init app
const app = express();

//
mongoose
  .connect(process.env.MONGO_KEY)
  .then(() => console.log(`MongoDB Connected... - ${process.env.MONGO_KEY}`))
  .catch((err) => console.log(err));
// END DATABASE

// MIDDLEWARES
app.use(
  cors({
    origin: "*",
    credentials: true, //access-control-allow-credentials:true
    optionSuccessStatus: 200,
  })
);
app.use(express.json()); //n1
app.use(morgan("dev"));
app.use(cookieParser());
app.use(expressValidator());
app.use(fileUpload({useTempFiles:true}));


//static folder
//app.use(express.static(path.join(__dirname, "client/build")));
app.use(function (req, res, next) {
  //res.setHeader("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.header("Access-Control-Expose-Headers", "X-Total-Count");
  next();
});


//API Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/farmer", require("./routes/farmer"))
app.use("/api",require("./routes/search"))



const listEndpoints = require("express-list-endpoints");
const broadcasts = require("./sockets/broadcasts");
const order = require("./sockets/order");

app.use("/docs-api", (req, res) => {
  res.json(listEndpoints(app));
});

app.get("*", (req, res) => {
  res.status(404).json({message:"Error Route"});
});
// END MIDDLEWARES

const port = process.env.PORT || 8002;
const server = app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

const io = require("./socket").init(server);

io.on("connection", (_socket) => {
  sockets(io, _socket);
  broadcasts(io, _socket);
  order(io, _socket);
});

global.io = io;

