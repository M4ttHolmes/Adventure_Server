const Express = require('express');
const app = Express();
require("dotenv").config();

app.listen(process.env.PORT, () => {
console.log(`[Server]: App is listening on ${process.env.PORT}.`);
});
