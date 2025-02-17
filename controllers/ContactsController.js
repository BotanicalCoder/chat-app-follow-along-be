import User from "../models/UserModel.js";
import Message from "../models/MessagesModel.js";
import mongoose from "mongoose";

export const search_contacts = async (req, res, next) => {
  try {
    const { term } = req.body;

    if (!term) {
      return res.status(200).json({
        message: "Contacts retrieved successfully",
        data: [],
      });
    }

    const sanitizeTerm = term
      .trim()
      .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "")
      .toLowerCase();

    const regex = new RegExp(sanitizeTerm, "i");

    const contacts = await User.find({
      $and: [
        {
          _id: {
            $ne: req.user.userid,
          },
          $or: [
            {
              first_name: regex,
            },
            {
              last_name: regex,
            },
            {
              email: regex,
            },
          ],
        },
      ],
    });

    return res.status(200).json({
      message: "Contacts retrieved successfully",
      data: contacts,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const get_contacts_for_dm_list = async (req, res, next) => {
  try {
   
    const user_id = req.user.userid;

    const typed_user_id = new mongoose.Types.ObjectId(user_id);

    const contacts = await Message.aggregate([
      
    {  $match:{
          $or:[
            {sender:typed_user_id},
            {recipient:typed_user_id}
          ]
        },},
     {   $sort:{
          timestamp:-1
        },},
      {  $group:{
          _id:{
            $cond: {
              if:  {
                $eq:['$sender', typed_user_id]
              },
              then:'$recipient',
              else:
                '$sender'
            }
          },
          last_message_time:{
            $first:'$timestamp'
          }
        },},
     {   $lookup:{
          from :"users",
          localField:"_id",
          foreignField:"_id",
          as:"contactInfo"
        },},
      {  $unwind:"$contactInfo",},
      {  $project:{
          _id:1,
          last_message_time:1,
          email:"$contactInfo.email",
          first_name:"$contactInfo.first_name",
          last_name:"$contactInfo.last_name",
          img:"$contactInfo.img",
          color:"$contactInfo.color"
        }}
    ])

    return res.status(200).json({
      message: "Contacts retrieved successfully",
      data: contacts,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const get_all_contacts = async (req, res, next) => {
  try {

    const users = await User.find(
      {_id:{$ne:req.user.userid}},
      "first_name last_name _id"
    );

   // use a db function to manipulate the data later
   const allContacts = users.map((user) => {
    return {
      label:  user.first_name? user.first_name + " " + user.last_name: user.email,
      value: user._id,
    };
  });


    return res.status(200).json({
      message: "Contacts retrieved successfully",
      data: allContacts,
    })

  } catch (error) {
    console.log(error);

    return res.status(500).json({ message: "Internal Server Error" });
  }
};