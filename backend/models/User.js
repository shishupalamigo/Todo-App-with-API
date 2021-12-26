var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema(
  {
    name: { type: String },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
  },
  { timestamps: true }
);

// Hashing the password
userSchema.pre('save', async function (next) {
  try {
    if (this.password && this.isModified('password')) {
      this.password = await bcrypt.hash(this.password, 10);
    }
    return next();
  } catch (error) {
    return next(error);
  }
});

//Method for verification of Password
userSchema.methods.verifyPassword = async function (password) {
  try {
    let result = await bcrypt.compare(password, this.password);
    return result;
  } catch (error) {
    return error;
  }
};

// Method for signing the token
userSchema.methods.signToken = async function () {
  try {
    let payload = {
      userId: this.id,
      email: this.email,
      name: this.name,
    };

    let token = await jwt.sign(payload, process.env.JWTSECRET);
    return token;
  } catch (error) {
    return error;
  }
};
userSchema.methods.userJSON = function (token) {
  return {
    name: this.name,
    email: this.email,
    token: token,
  };
};

module.exports = mongoose.model('User', userSchema);
