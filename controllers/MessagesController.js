import Message from "../models/MessagesModel.js";
import {mkdirSync, renameSync} from 'fs'
export const get_messages = async (req, res, next) => {
  try {

    const user1 = req.user.userid;
    const user2 = req.body.id;


   if (!user1 || !user2) {
      return res.status(400).json({ message: "Both user ids are required" });
    }

    const messages = await Message.find({
    $or:[
      {
        sender: user1,
        recipient: user2
      },{
        sender: user2,
        recipient: user1
      }
    ]
    })
    .sort({ timestamp: 1 });
   
    return res.status(200).json({
      message: "Messages retrieved successfully",
      data: messages,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const upload_file = async (req, res, next) => {
  try {

    if (!req.file) {
      return res.status(400).json({ message: "Please provide a file" });
    }
   
    const date = Date.now();
    let fileDir = `uploads/files/${date}`;
    const fileName =`${fileDir}/${req.file.originalname}`.replace(/\s+/g, "-");


      mkdirSync(fileDir, { recursive: true });

      renameSync(
        req.file.path,
        fileName
      );
    return res.status(200).json({
      message: "file uploaded successfully",
      data: fileName,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({ message: "Internal Server Error" });
  }
};
