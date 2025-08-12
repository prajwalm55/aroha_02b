// import { getReceiverSocketId, io } from "../SocketIO/server.js";
// import Conversation from "../models/conversation.model.js";
// import Message from "../models/message.model.js";
// export const sendMessage = async (req, res) => {
//   try {
//     const { message } = req.body;
//     const { id: receiverId } = req.params;
//     const senderId = req.user._id; // current logged in user
//     let conversation = await Conversation.findOne({
//       members: { $all: [senderId, receiverId] },
//     });
//     if (!conversation) {
//       conversation = await Conversation.create({
//         members: [senderId, receiverId],
//       });
//     }
//     const newMessage = new Message({
//       senderId,
//       receiverId,
//       message,
//     });
//     if (newMessage) {
//       conversation.messages.push(newMessage._id);
//     }
//     // await conversation.save()
//     // await newMessage.save();
//     await Promise.all([conversation.save(), newMessage.save()]); // run parallel
//     const receiverSocketId = getReceiverSocketId(receiverId);
//     if (receiverSocketId) {
//       io.to(receiverSocketId).emit("newMessage", newMessage);
//     }
//     res.status(201).json(newMessage);
//   } catch (error) {
//     console.log("Error in sendMessage", error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// };

// export const getMessage = async (req, res) => {
//   try {
//     const { id: chatUser } = req.params;
//     const senderId = req.user._id; // current logged in user
//     let conversation = await Conversation.findOne({
//       members: { $all: [senderId, chatUser] },
//     }).populate("messages");
//     if (!conversation) {
//       return res.status(201).json([]);
//     }
//     const messages = conversation.messages;
//     res.status(201).json(messages);
//   } catch (error) {
//     console.log("Error in getMessage", error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// };


//new

// import { getReceiverSocketId, io } from "../SocketIO/server.js";
// import Conversation from "../models/conversation.model.js";
// import Message from "../models/message.model.js";

// export const sendMessage = async (req, res) => {
//   try {
//     const { message } = req.body;
//     const { id: receiverId } = req.params;
//     const senderId = req.user._id; // current logged in user

//     let conversation = await Conversation.findOne({
//       members: { $all: [senderId, receiverId] },
//     });

//     if (!conversation) {
//       conversation = await Conversation.create({
//         members: [senderId, receiverId],
//       });
//     }

//     const newMessage = new Message({
//       senderId,
//       receiverId,
//       message,
//     });

//     if (newMessage) {
//       conversation.messages.push(newMessage._id);
//     }

//     // await conversation.save()
//     // await newMessage.save();
//     await Promise.all([conversation.save(), newMessage.save()]); // run parallel

//     const receiverSocketId = getReceiverSocketId(receiverId);
//     if (receiverSocketId) {
//       io.to(receiverSocketId).emit("newMessage", newMessage);
//     }

//     res.status(201).json(newMessage);
//   } catch (error) {
//     console.log("Error in sendMessage", error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// };

// export const getMessage = async (req, res) => {
//   try {
//     const { id: chatUser } = req.params;
//     const senderId = req.user._id; // current logged in user

//     let conversation = await Conversation.findOne({
//       members: { $all: [senderId, chatUser] },
//     }).populate("messages");

//     if (!conversation) {
//       return res.status(201).json([]);
//     }

//     const messages = conversation.messages;
//     res.status(201).json(messages);
//   } catch (error) {
//     console.log("Error in getMessage", error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// };

// // New function to clear chat
// export const clearChat = async (req, res) => {
//   try {
//     const { id: chatUser } = req.params;
//     const senderId = req.user._id; // current logged in user

//     // Find the conversation
//     let conversation = await Conversation.findOne({
//       members: { $all: [senderId, chatUser] },
//     });

//     if (!conversation) {
//       return res.status(404).json({ error: "Conversation not found" });
//     }

//     // Get all message IDs from the conversation
//     const messageIds = conversation.messages;

//     // Delete all messages from the Message collection
//     await Message.deleteMany({
//       _id: { $in: messageIds }
//     });

//     // Clear the messages array in the conversation
//     conversation.messages = [];
//     await conversation.save();

//     // Emit socket event to notify both users that chat was cleared
//     const receiverSocketId = getReceiverSocketId(chatUser);
//     const senderSocketId = getReceiverSocketId(senderId);

//     if (receiverSocketId) {
//       io.to(receiverSocketId).emit("chatCleared", { conversationId: conversation._id });
//     }
//     if (senderSocketId) {
//       io.to(senderSocketId).emit("chatCleared", { conversationId: conversation._id });
//     }

//     res.status(200).json({ 
//       message: "Chat cleared successfully",
//       conversationId: conversation._id 
//     });

//   } catch (error) {
//     console.log("Error in clearChat", error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// };













import { getReceiverSocketId, io } from "../SocketIO/server.js";
import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";

export const sendMessage = async (req, res) => {
  try {
    const { message } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user._id; // current logged in user

    let conversation = await Conversation.findOne({
      members: { $all: [senderId, receiverId] },
    });

    if (!conversation) {
      conversation = await Conversation.create({
        members: [senderId, receiverId],
      });
    }

    const newMessage = new Message({
      senderId,
      receiverId,
      message,
    });

    if (newMessage) {
      conversation.messages.push(newMessage._id);
    }

    // await conversation.save()
    // await newMessage.save();
    await Promise.all([conversation.save(), newMessage.save()]); // run parallel

    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }

    res.status(201).json(newMessage);
  } catch (error) {
    console.log("Error in sendMessage", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getMessage = async (req, res) => {
  try {
    const { id: chatUser } = req.params;
    const senderId = req.user._id; // current logged in user

    let conversation = await Conversation.findOne({
      members: { $all: [senderId, chatUser] },
    }).populate("messages");

    if (!conversation) {
      return res.status(201).json([]);
    }

    const messages = conversation.messages;
    res.status(201).json(messages);
  } catch (error) {
    console.log("Error in getMessage", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// New function to clear chat
export const clearChat = async (req, res) => {
  try {
    const { id: chatUser } = req.params;
    const senderId = req.user._id; // current logged in user

    // Find the conversation
    let conversation = await Conversation.findOne({
      members: { $all: [senderId, chatUser] },
    });

    if (!conversation) {
      return res.status(404).json({ error: "Conversation not found" });
    }

    // Get all message IDs from the conversation
    const messageIds = conversation.messages;

    // Delete all messages from the Message collection
    await Message.deleteMany({
      _id: { $in: messageIds }
    });

    // Clear the messages array in the conversation
    conversation.messages = [];
    await conversation.save();

    // Emit socket event to notify both users that chat was cleared
    const receiverSocketId = getReceiverSocketId(chatUser);
    const senderSocketId = getReceiverSocketId(senderId);

    if (receiverSocketId) {
      io.to(receiverSocketId).emit("chatCleared", { conversationId: conversation._id });
    }
    if (senderSocketId) {
      io.to(senderSocketId).emit("chatCleared", { conversationId: conversation._id });
    }

    res.status(200).json({ 
      message: "Chat cleared successfully",
      conversationId: conversation._id 
    });

  } catch (error) {
    console.log("Error in clearChat", error);
    res.status(500).json({ error: "Internal server error" });
  }
};