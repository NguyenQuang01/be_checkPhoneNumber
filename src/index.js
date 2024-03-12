const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const port = 3000;
const routerAccount = require("./router/apiLogin.js");
const routerEmail = require("./router/apiMail.js");
const router2 = require("./router/apiLogin.js");
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());
app.use("/v1/", [routerAccount, routerEmail]);
app.use("/v2/", router2);
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
