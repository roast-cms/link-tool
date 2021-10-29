"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var app_1 = require("./app");
// eslint-disable-next-line
require("dotenv").config();
var app = express();
app.get("/recommends/:key", app_1.default);
var port = process.env.PORT || 3000;
app.listen(port, function () {
    console.log("App is running on :" + port);
});
