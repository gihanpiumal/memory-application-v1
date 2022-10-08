const userModal = require("../models/userModel");
const Joi = require("joi");
const bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");
const ApiResponse = require("../services/response_helper");
const uniqueValidator = require("../services/unique_validator");
const otp_verification = require("../services/otp_verification");
var nodemailer = require("nodemailer");

////////////////////// ADD NEW USER /////////////////////////
exports.addUser = async function (req, res) {
  let request = req.body;
  // console.log(request);

  const schema = Joi.object({
    firstName: Joi.string().required().label("First Name"),
    lastName: Joi.string().required().label("Last Name"),
    email: Joi.string()
      .required()
      .empty("")
      .regex(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        "xxx@xx.xx",
        ""
      )
      .label("Email"),
    phone: Joi.string()
      .required()
      .regex(
        /^(070)\d{7}$|^(071)\d{7}$|^(072)\d{7}$|^(074)\d{7}$|^(075)\d{7}$|^(076)\d{7}$|^(077)\d{7}$|^(078)\d{7}$/,
        "07xxxxxxxx"
      )
      .label("Mobile Number"),
    Avatar: Joi.string().empty("").label("Profile Picture"),
    password: Joi.string().required().label("Password"),
    isVerified: Joi.boolean().required().label("Verified"),
    OTPCode: Joi.number().optional().label("OTP"),
  });
  let validateResult = schema.validate(request);

  if (validateResult.error) {
    console.log("1");
    return res
      .status(400)
      .send(ApiResponse.getError(validateResult.error.details[0].message));
  }

  let uniqueValidatorResponse = await uniqueValidator.findUnique(userModal, [
    { email: request.email },
  ]);
  if (uniqueValidatorResponse) {
    console.log("2");
    return res.status(409).send(ApiResponse.getError(uniqueValidatorResponse));
  }

  let newUser = userModal(req.body);
  const saltRounds = 10;

  const hashPassword = "";

  bcrypt.genSalt(saltRounds, function (saltError, salt) {
    if (saltError) {
      throw saltError;
    } else {
      bcrypt.hash(newUser.password, salt, function (hashError, hash) {
        if (hashError) {
          throw hashError;
        } else {
          newUser.password = hash;

          newUser.save((err, addedData) => {
            if (err) {
              console.log("3");
              return res.status(400).json(
                ApiResponse.getError({
                  error: err,
                })
              );
            }
            return res.status(200).json(
              ApiResponse.getSuccess({
                details: addedData,
              })
            );
          });
        }
      });
    }
  });
};

////////////////// login ////////////////

exports.loging = async function (req, res) {
  let request = req.body;

  const schema = Joi.object({
    email: Joi.string()
      .required()
      .empty("")
      .regex(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        "xxx@xx.xx",
        ""
      )
      .label("Email"),
    password: Joi.string().required().label("password"),
  });

  let validateResult = schema.validate(request);
  if (validateResult.error) {
    return res
      .status(400)
      .send(ApiResponse.getError(validateResult.error.details[0].message));
  }

  let user = await userModal.findOne({ email: request.email });

  if (user && (await bcrypt.compare(request.password, user.password))) {
    return res.status(200).json(
      ApiResponse.getSuccess({
        details: "Done Login",
        token: jwt.sign(
          {
            _id: user._id,
            email: user.email,
          },
          process.env.secretKey,
          { expiresIn: 30000 }
        ),
      })
    );
  } else {
    return res
      .status(401)
      .send(ApiResponse.getError("Invalid user name or password"));
  }
};

exports.getUser = async function (req, res) {
  let request = req.body;

  condition = {
    $and: [
      request.email === ""
        ? {}
        : {
          email: request.email,
          },
    ],
  };

  let user = await userModal.aggregate([
    { $match: condition },
    // {
    //   $lookup: {
    //     from: "userroles",
    //     localField: "userRoleId",
    //     foreignField: "_id",
    //     as: "userRole",
    //   },
    // },
    // {
    //   $unwind: {
    //     path: "$spec",
    //     preserveNullAndEmptyArrays: true,
    //   },
    // },
  ]);

  if (user) {
    return res.status(200).json(
      ApiResponse.getSuccess({
        details: user,
      })
    );
  }
  return res.status(400).json(
    ApiResponse.getError({
      error: err,
    })
  );
};

exports.updateUser = async function (req, res) {
  let request = req.body;
  let userId = req.params.id;
  let validationObject = request;
  validationObject.userId = userId;

  const schema = Joi.object({
    userId: Joi.string()
      .required()
      .regex(/^(?=[a-f\d]{24}$)(\d+[a-f]|[a-f]+\d)/i)
      .label("User ID")
      .messages({ "string.pattern.base": "Invalid user id" }),
    firstName: Joi.string().required().label("First Name"),
    lastName: Joi.string().required().label("Last Name"),
    phone: Joi.string()
      .required()
      .regex(
        /^(070)\d{7}$|^(071)\d{7}$|^(072)\d{7}$|^(074)\d{7}$|^(075)\d{7}$|^(076)\d{7}$|^(077)\d{7}$|^(078)\d{7}$/,
        "07xxxxxxxx"
      )
      .label("Mobile Number"),
    Avatar: Joi.string().empty("").label("Avatar"),
  });

  let validateResult = schema.validate(validationObject);

  if (validateResult.error) {
    return res
      .status(400)
      .send(ApiResponse.getError(validateResult.error.details[0].message));
  }
  let uniqueValidatorResponse = await uniqueValidator.findUniqueForUpdate(
    userId,
    userModal,
    [{ email: request.email }]
  );
  if (uniqueValidatorResponse) {
    return res.status(409).send(ApiResponse.getError(uniqueValidatorResponse));
  }

  let user = await userModal.findByIdAndUpdate(
    { _id: userId },
    {
      $set: request,
    },
    { new: true }
  );

  let returnObject = user.toJSON();

  if (user) {
    return res.status(200).json(
      ApiResponse.getSuccess({
        details: returnObject,
      })
    );
  }
};

exports.deleteUser = function (req, res) {
  userModal.findByIdAndRemove(req.params.id).exec((err, deletedUser) => {
    if (err) {
      return res.status(400).json({ message: "Not deleted", err });
    }
    return res.json(
      ApiResponse.getSuccess({
        details: deletedUser,
      })
    );
  });
};

exports.emailVerification = async function (req, res) {
  let request = req.body;
  let userId = req.params.id;

  let user = await userModal.findById(userId);

  let tempRequest = {
    isVerified: true,
  };

  if (user.OTPCode == request.OTP) {
    let users = await userModal.findByIdAndUpdate(
      { _id: userId },
      {
        $set: tempRequest,
      },
      { new: true }
    );
    return res.json(
      ApiResponse.getSuccess({
        details: "Email veryfied sucessfully",
      })
    );
  } else {
    return res.status(400).json({ message: "email is not veryfied" });
  }
};

exports.resetPassword = async function (req, res) {
  let request = req.body;
  let _id = request._id;
  const saltRounds = 10;

  let tempRequest = {
    password: request.newPassword,
  };

  bcrypt.genSalt(saltRounds, async function (saltError, salt) {
    if (saltError) {
      throw saltError;
    } else {
      await bcrypt.hash(tempRequest.password, salt, function (hashError, hash) {
        if (hashError) {
          throw hashError;
        } else {
          tempRequest.password = hash;
          userModal.findOne({ _id: _id }, async function (err, doc) {
            if (doc.OTPCode == request.OTP) {
              let users = await userModal.findByIdAndUpdate(
                { _id: doc._id },
                {
                  $set: tempRequest,
                },
                { new: true }
              );
              return res.json(
                ApiResponse.getSuccess({
                  details: "Password Reset sucessfully",
                })
              );
            } else {
              return res.status(400).json({ message: "Password not reset" });
            }
          });
        }
      });
    }
  });

  console.log(tempRequest.password);
};

exports.sendOtp = async function (req, res) {
  let request = req.body;
  let userId = req.params.id;

  const schema = Joi.object({
    email: Joi.string()
      .required()
      .empty("")
      .regex(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        "xxx@xx.xx",
        ""
      )
      .label("Email"),
  });

  let validateResult = schema.validate(request);

  if (validateResult.error) {
    return res
      .status(400)
      .send(ApiResponse.getError(validateResult.error.details[0].message));
  }

  // let uniqueValidatorResponse = await uniqueValidator.findUnique(userModal, [
  //   { email: request.email },
  // ]);
  // if (uniqueValidatorResponse) {
  //   return res.status(409).send(ApiResponse.getError(uniqueValidatorResponse));
  // }

  let email = request.email;
  let otp = await otp_verification.otpSend(email);
  console.log(otp);

  let tempRequest = {
    OTPCode: otp.OTP,
  };

  if (otp.success) {
    let user = await userModal.findByIdAndUpdate(
      { _id: userId },
      {
        $set: tempRequest,
      },
      { new: true }
    );

    console.log(user);
    return res.json(
      ApiResponse.getSuccess({
        details: "Check your email..",
      })
    );
  } else {
    return res
      .status(400)
      .json({ message: "can't send the OTP", error: otp.err });
  }
};
