const app = require("./app");
const config = require("./config/env");

app.listen(config.port, () => {
  console.log(`GrindHaus API running on http://localhost:${config.port}${config.apiPrefix}`);
});
