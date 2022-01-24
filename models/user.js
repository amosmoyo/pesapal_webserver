const crypto = require('crypto');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a name'],
      },
      email: {
        type: String,
        required: [true, 'Please add an email'],
        unique: true,
        match: [
          /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
          'Please add a valid email',
        ],
      },
      password: {
        type: String,
        required: [true, 'Please add a password'],
        minlength: 6,
        select: false,
      }
}, { timestamps: true } );

UserSchema.pre('save', async function (next) {
    if(this.isModified('password')){
        next()
    };

    const salt = await bcrypt.genSalt(10);

    this.password = await bcrypt.hash(this.password, salt)
})

UserSchema.methods.getSecret = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
}

UserSchema.methods.comparePassword = async function(newPass) {
    return await bcrypt.compare(newPass, this.password);
}

module.exports = mongoose.model("User", UserSchema)