import { genSalt, hash } from "bcrypt";
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "Please enter your email"],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Please is required"],
  },
  first_name: {
    type: String,
    required: [false],
  },
  last_name: { type: String, required: [false] },
  img: { type: String, required: [false] },
  color: { type: String, required: [false] },
  profile_setup: { type: Boolean, default: false },
});

userSchema.pre("save", async function (next) {
  const salt = await genSalt(10);
  this.password = hash(this.password, salt);
  next();
});

userSchema.methods.comparePassword = function (candidatePassword, cb) {
  bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
    if (err) {
      return cb(err);
    }
    cb(null, isMatch);
  });
};

const User = mongoose.model("Users", userSchema);

export default User;
