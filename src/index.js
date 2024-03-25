const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const port = 4303;
const routerCheckPhoneNumber = require("./router/apiPhoneNumber.js");
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());
app.use("/v1/", routerCheckPhoneNumber);
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
