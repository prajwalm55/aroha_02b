import { getReceiverSocketId, io } from "../SocketIO/server.js";
import Conversation from "../models/conversation.model.js";
import User from "../models/user.model.js";

export const createGroup = async (req, res) => {
  try {
    const { groupName, memberIds } = req.body;
    const adminId = req.user._id;

    // Validate input
    if (!groupName || !memberIds || memberIds.length < 1) {
      return res.status(400).json({ error: "Group name and at least 1 member are required" });
    }

    // Add admin to members if not already included
    const allMembers = [...new Set([adminId.toString(), ...memberIds])];

    // Create group conversation
    const groupConversation = await Conversation.create({
      members: allMembers,
      isGroup: true,
      groupName,
      groupAdmin: adminId,
    });

    // Populate the created group with member details
    const populatedGroup = await Conversation.findById(groupConversation._id)
      .populate("members", "fullname email avatar")
      .populate("groupAdmin", "fullname email");

    // Emit socket event to all group members
    allMembers.forEach((memberId) => {
      if (memberId !== adminId.toString()) {
        const memberSocketId = getReceiverSocketId(memberId);
        if (memberSocketId) {
          io.to(memberSocketId).emit("newGroup", populatedGroup);
        }
      }
    });

    res.status(201).json(populatedGroup);
  } catch (error) {
    console.log("Error in createGroup", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getGroups = async (req, res) => {
  try {
    const userId = req.user._id;

    const groups = await Conversation.find({
      members: userId,
      isGroup: true,
    })
      .populate("members", "fullname email avatar")
      .populate("groupAdmin", "fullname email")
      .sort({ updatedAt: -1 });

    res.status(200).json(groups);
  } catch (error) {
    console.log("Error in getGroups", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const addMemberToGroup = async (req, res) => {
  try {
    const { groupId } = req.params;
    const { memberId } = req.body;
    const adminId = req.user._id;

    // Find the group
    const group = await Conversation.findById(groupId);
    if (!group || !group.isGroup) {
      return res.status(404).json({ error: "Group not found" });
    }

    // Check if user is admin
    if (group.groupAdmin.toString() !== adminId.toString()) {
      return res.status(403).json({ error: "Only group admin can add members" });
    }

    // Check if member is already in group
    if (group.members.includes(memberId)) {
      return res.status(400).json({ error: "User is already a member" });
    }

    // Add member to group
    group.members.push(memberId);
    await group.save();

    // Populate and return updated group
    const updatedGroup = await Conversation.findById(groupId)
      .populate("members", "fullname email avatar")
      .populate("groupAdmin", "fullname email");

    // Emit socket event to new member
    const memberSocketId = getReceiverSocketId(memberId);
    if (memberSocketId) {
      io.to(memberSocketId).emit("addedToGroup", updatedGroup);
    }

    // Emit to all existing members
    group.members.forEach((member) => {
      const socketId = getReceiverSocketId(member.toString());
      if (socketId) {
        io.to(socketId).emit("memberAdded", { groupId, newMember: memberId });
      }
    });

    res.status(200).json(updatedGroup);
  } catch (error) {
    console.log("Error in addMemberToGroup", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const removeMemberFromGroup = async (req, res) => {
  try {
    const { groupId } = req.params;
    const { memberId } = req.body;
    const adminId = req.user._id;

    // Find the group
    const group = await Conversation.findById(groupId);
    if (!group || !group.isGroup) {
      return res.status(404).json({ error: "Group not found" });
    }

    // Check if user is admin or removing themselves
    if (group.groupAdmin.toString() !== adminId.toString() && memberId !== adminId.toString()) {
      return res.status(403).json({ error: "Only group admin can remove members" });
    }

    // Remove member from group
    group.members = group.members.filter(member => member.toString() !== memberId);
    await group.save();

    // Emit socket event to removed member
    const memberSocketId = getReceiverSocketId(memberId);
    if (memberSocketId) {
      io.to(memberSocketId).emit("removedFromGroup", { groupId });
    }

    // Emit to remaining members
    group.members.forEach((member) => {
      const socketId = getReceiverSocketId(member.toString());
      if (socketId) {
        io.to(socketId).emit("memberRemoved", { groupId, removedMember: memberId });
      }
    });

    res.status(200).json({ message: "Member removed successfully" });
  } catch (error) {
    console.log("Error in removeMemberFromGroup", error);
    res.status(500).json({ error: "Internal server error" });
  }
};







// import { getReceiverSocketId, io } from "../SocketIO/server.js";
// import Conversation from "../models/conversation.model.js";
// import User from "../models/user.model.js";

// export const createGroup = async (req, res) => {
//   try {
//     console.log("Create group request received:", req.body);
//     console.log("User from token:", req.user);

//     const { groupName, memberIds } = req.body;
//     const adminId = req.user._id;

//     // Validate input
//     if (!groupName || !groupName.trim()) {
//       return res.status(400).json({ error: "Group name is required" });
//     }

//     if (!memberIds || !Array.isArray(memberIds) || memberIds.length < 1) {
//       return res.status(400).json({ error: "At least 1 member is required" });
//     }

//     // Validate that all member IDs are valid ObjectIds
//     const validMemberIds = [];
//     for (const memberId of memberIds) {
//       try {
//         const user = await User.findById(memberId);
//         if (user) {
//           validMemberIds.push(memberId);
//         }
//       } catch (error) {
//         console.log("Invalid member ID:", memberId);
//       }
//     }

//     if (validMemberIds.length === 0) {
//       return res.status(400).json({ error: "No valid members found" });
//     }

//     // Add admin to members if not already included
//     const allMembers = [...new Set([adminId.toString(), ...validMemberIds])];

//     console.log("Creating group with members:", allMembers);

//     // Create group conversation
//     const groupConversation = await Conversation.create({
//       members: allMembers,
//       isGroup: true,
//       groupName: groupName.trim(),
//       groupAdmin: adminId,
//       messages: []
//     });

//     console.log("Group created:", groupConversation);

//     // Populate the created group with member details
//     const populatedGroup = await Conversation.findById(groupConversation._id)
//       .populate("members", "fullname email avatar")
//       .populate("groupAdmin", "fullname email");

//     console.log("Populated group:", populatedGroup);

//     // Emit socket event to all group members (except admin)
//     allMembers.forEach((memberId) => {
//       if (memberId !== adminId.toString()) {
//         const memberSocketId = getReceiverSocketId(memberId);
//         if (memberSocketId) {
//           io.to(memberSocketId).emit("newGroup", populatedGroup);
//         }
//       }
//     });

//     res.status(201).json({
//       message: "Group created successfully",
//       group: populatedGroup
//     });
//   } catch (error) {
//     console.log("Error in createGroup:", error);
//     res.status(500).json({ error: "Internal server error", details: error.message });
//   }
// };

// export const getGroups = async (req, res) => {
//   try {
//     const userId = req.user._id;

//     const groups = await Conversation.find({
//       members: userId,
//       isGroup: true,
//     })
//       .populate("members", "fullname email avatar")
//       .populate("groupAdmin", "fullname email")
//       .populate({
//         path: "messages",
//         options: { limit: 1, sort: { createdAt: -1 } }
//       })
//       .sort({ updatedAt: -1 });

//     res.status(200).json(groups);
//   } catch (error) {
//     console.log("Error in getGroups:", error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// };

// export const addMemberToGroup = async (req, res) => {
//   try {
//     const { groupId } = req.params;
//     const { memberId } = req.body;
//     const adminId = req.user._id;

//     // Find the group
//     const group = await Conversation.findById(groupId);
//     if (!group || !group.isGroup) {
//       return res.status(404).json({ error: "Group not found" });
//     }

//     // Check if user is admin
//     if (group.groupAdmin.toString() !== adminId.toString()) {
//       return res.status(403).json({ error: "Only group admin can add members" });
//     }

//     // Check if member exists
//     const user = await User.findById(memberId);
//     if (!user) {
//       return res.status(404).json({ error: "User not found" });
//     }

//     // Check if member is already in group
//     if (group.members.includes(memberId)) {
//       return res.status(400).json({ error: "User is already a member" });
//     }

//     // Add member to group
//     group.members.push(memberId);
//     await group.save();

//     // Populate and return updated group
//     const updatedGroup = await Conversation.findById(groupId)
//       .populate("members", "fullname email avatar")
//       .populate("groupAdmin", "fullname email");

//     // Emit socket event to new member
//     const memberSocketId = getReceiverSocketId(memberId);
//     if (memberSocketId) {
//       io.to(memberSocketId).emit("addedToGroup", updatedGroup);
//     }

//     // Emit to all existing members
//     group.members.forEach((member) => {
//       const socketId = getReceiverSocketId(member.toString());
//       if (socketId) {
//         io.to(socketId).emit("memberAdded", { groupId, newMember: memberId });
//       }
//     });

//     res.status(200).json(updatedGroup);
//   } catch (error) {
//     console.log("Error in addMemberToGroup:", error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// };

// export const removeMemberFromGroup = async (req, res) => {
//   try {
//     const { groupId } = req.params;
//     const { memberId } = req.body;
//     const adminId = req.user._id;

//     // Find the group
//     const group = await Conversation.findById(groupId);
//     if (!group || !group.isGroup) {
//       return res.status(404).json({ error: "Group not found" });
//     }

//     // Check if user is admin or removing themselves
//     if (group.groupAdmin.toString() !== adminId.toString() && memberId !== adminId.toString()) {
//       return res.status(403).json({ error: "Only group admin can remove members" });
//     }

//     // Remove member from group
//     group.members = group.members.filter(member => member.toString() !== memberId);
//     await group.save();

//     // Emit socket event to removed member
//     const memberSocketId = getReceiverSocketId(memberId);
//     if (memberSocketId) {
//       io.to(memberSocketId).emit("removedFromGroup", { groupId });
//     }

//     // Emit to remaining members
//     group.members.forEach((member) => {
//       const socketId = getReceiverSocketId(member.toString());
//       if (socketId) {
//         io.to(socketId).emit("memberRemoved", { groupId, removedMember: memberId });
//       }
//     });

//     res.status(200).json({ message: "Member removed successfully" });
//   } catch (error) {
//     console.log("Error in removeMemberFromGroup:", error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// };