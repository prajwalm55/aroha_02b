import express from "express";
import { createGroup, getGroups, addMemberToGroup, removeMemberFromGroup } from "../controller/group.controller.js";
import secureRoute from "../middleware/secureRoute.js";

const router = express.Router();

router.post("/create", secureRoute, createGroup);
router.get("/", secureRoute, getGroups);
router.post("/add-member/:groupId", secureRoute, addMemberToGroup);
router.delete("/remove-member/:groupId", secureRoute, removeMemberFromGroup);

export default router;