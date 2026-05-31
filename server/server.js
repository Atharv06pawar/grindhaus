const app = require("./src/app");
const config = require("./src/config/env");

if (require.main === module) {
  app.listen(config.port, () => {
    console.log(`REDAESTH API running on http://localhost:${config.port}${config.apiPrefix}`);
  });
}

module.exports = app;
