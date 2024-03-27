const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const port = 4303;
const routerCheckPhoneNumber = require("./router/apiPhoneNumber.js");
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());
//cors
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "*");
    next();
});

app.use("/v1/", routerCheckPhoneNumber);
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
