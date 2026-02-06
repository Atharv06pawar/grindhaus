const { sendToCpp } = require("./bridge");

(async () => {
    const reply = await sendToCpp("Hello Trainer");
    console.log("CPP replied:", reply);
})();
