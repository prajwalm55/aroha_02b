// import express from "express";
// import { getMessage, sendMessage } from "../controller/message.controller.js";
// import secureRoute from "../middleware/secureRoute.js";

// const router = express.Router();
// router.post("/send/:id", secureRoute, sendMessage);
// router.get("/get/:id", secureRoute, getMessage);

// export default router;




// new






import express from "express";
import { getMessage, sendMessage, clearChat } from "../controller/message.controller.js";
import secureRoute from "../middleware/secureRoute.js";

const router = express.Router();

router.post("/send/:id", secureRoute, sendMessage);
router.get("/get/:id", secureRoute, getMessage);
router.delete("/clear/:id", secureRoute, clearChat); // New route for clearing chat

export default router;