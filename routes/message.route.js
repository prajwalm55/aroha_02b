// import express from "express";
// import { getMessage, sendMessage, clearChat } from "../controller/message.controller.js";
// import secureRoute from "../middleware/secureRoute.js";

// const router = express.Router();

// router.post("/send/:id", secureRoute, sendMessage);
// router.get("/get/:id", secureRoute, getMessage);
// router.delete("/clear/:id", secureRoute, clearChat); // New route for clearing chat

// export default router;




//group




import express from "express";
import { 
  getMessage, 
  sendMessage, 
  clearChat,
  sendGroupMessage,
  getGroupMessages 
} from "../controller/message.controller.js";
import secureRoute from "../middleware/secureRoute.js";

const router = express.Router();

// Individual chat routes
router.post("/send/:id", secureRoute, sendMessage);
router.get("/get/:id", secureRoute, getMessage);
router.delete("/clear/:id", secureRoute, clearChat);

// Group chat routes
router.post("/group/send/:groupId", secureRoute, sendGroupMessage);
router.get("/group/get/:groupId", secureRoute, getGroupMessages);

export default router;