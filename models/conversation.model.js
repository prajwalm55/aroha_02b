// import mongoose from "mongoose";
// import User from "../models/user.model.js";
// import Message from "./message.model.js";
// const conversationSchema = new mongoose.Schema(
//   {
//     members: [
//       {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: User,
//       },
//     ],
//     messages: [
//       {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: Message,
//         default: [],
//       },
//     ],
//   },
//   { timestamps: true }
// );

// const Conversation = mongoose.model("conversation", conversationSchema);
// export default Conversation;


// group




import mongoose from "mongoose";
import User from "../models/user.model.js";
import Message from "./message.model.js";

const conversationSchema = new mongoose.Schema(
  {
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: User,
      },
    ],
    messages: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: Message,
        default: [],
      },
    ],
    // New fields for group support
    isGroup: {
      type: Boolean,
      default: false,
    },
    groupName: {
      type: String,
      default: null,
    },
    groupAdmin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: User,
      default: null,
    },
    groupAvatar: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

const Conversation = mongoose.model("conversation", conversationSchema);
export default Conversation;