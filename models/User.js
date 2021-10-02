const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema(
  {
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
    role: {
      type: String,
      enum: ['user', 'publisher'],
      default: 'user',
    },
    password: {
      type: String,
      required: [true, 'Please add a password'],
      minlength: 6,
      select: false,
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    confirmEmailToken: String,
    //   isEmailConfirmed: {
    //     type: Boolean,
    //     default: false,
    //   },
    //   twoFactorCode: String,
    //   twoFactorCodeExpire: Date,
    //   twoFactorEnable: {
    //     type: Boolean,
    //     default: false,
    //   },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  }
  // TODO: it's possible to use time timestamps: true and remove createdAt
  // mongoose will make createdAt and updateAt for us
  // {
  //   timestamps: true,
  // }
);

module.exports = mongoose.model('User', UserSchema);
