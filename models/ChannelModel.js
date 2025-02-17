import mongoose from "mongoose";

const channelSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: "users", required: true }],
  admin: { type: mongoose.Schema.Types.ObjectId, ref: "users", required: true },
  messages: [{ type: mongoose.Schema.Types.ObjectId, ref: "messages", required: false }],
}, {
    timestamps: true,
});

const Channel = mongoose.model("channels", channelSchema);

export default Channel;