import User from "../models/UserModel.js";

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
