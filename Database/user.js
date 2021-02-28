require("dotenv").config();
const mongoose = require("mongoose");
const { Schema, model } = mongoose;

mongoose.connect(process.env.MONGODB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const userSchema = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  rememberToken: { type: String, unique: true },
  createdAt: { type: Date, default: Date.now() },
  accounts: { type: [{ name: String, server: String, results: [] }] },
});

const User = model("User", userSchema);

const addUser = async function (email, password) {
  const r = { res: null, err: null };

  try {
    const user = new User({ email, password });
    r.res = await user.save();
  } catch (err) {
    r.err = err;
  }

  return r;
};

const findByEmail = async function (email) {
  const r = { res: null, err: null };

  try {
    r.res = await User.findOne({ email });
  } catch (err) {
    r.err = err;
  }

  return r;
};

const findByToken = async function (rememberToken) {
  const r = { res: null, err: null };

  try {
    r.res = await User.findOne({ rememberToken });
  } catch (err) {
    r.err = err;
  }

  return r;
};

module.exports = { addUser, findByEmail, findByToken };
