const postModal = require("../models/post");
const Joi = require("joi");
const ApiResponse = require("../services/response_helper");
const uniqueValidator = require("../services/unique_validator");
const mongoose = require("mongoose");

////////////////////// ADD NEW POST /////////////////////////
exports.addPost = async function (req, res) {
  let request = req.body;

  const schema = Joi.object({
    creator_id: Joi.string().required().label("Creatot ID"),
    title: Joi.string().required().label("Title"),
    date: Joi.date().raw().required().label("Date"),
    image: Joi.string().empty("").label("Image"),
    description: Joi.string().required().label("Description"),
    likeCount: Joi.number().required().label("Like Count"),
  });

  let validateResult = schema.validate(request);

  if (validateResult.error) {
    return res
      .status(400)
      .send(ApiResponse.getError(validateResult.error.details[0].message));
  }

  let newPost = postModal(req.body);
  newPost.save((err, addedData) => {
    if (err) {
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
};

exports.getPosts = async function (req, res) {
  let request = req.body;

  condition = {
    $and: [
      request.creator_id === ""
        ? {}
        : { creator_id: { $eq: mongoose.Types.ObjectId(request.creator_id) } },
      request.title === ""
        ? {}
        : {
            title: request.title,
          },
      request.date === ""
        ? {}
        : {
            date: request.date,
          },
    ],
  };

  let posts = await postModal.aggregate([
    { $match: condition },
    {
      $lookup: {
        from: "users",
        localField: "creator_id",
        foreignField: "_id",
        as: "creator_details",
      },
    },
    {
      $unwind: {
        path: "$spec",
        preserveNullAndEmptyArrays: true,
      },
    },
  ]);

  if (posts) {
    return res.status(200).json(
      ApiResponse.getSuccess({
        details: posts,
      })
    );
  }
  return res.status(400).json(
    ApiResponse.getError({
      error: err,
    })
  );
};

exports.updatePost = async function (req, res) {
  let request = req.body;
  let postId = req.params.id;
  let validationObject = request;
  validationObject.postId = postId;

  const schema = Joi.object({
    postId: Joi.string()
      .required()
      .regex(/^(?=[a-f\d]{24}$)(\d+[a-f]|[a-f]+\d)/i)
      .label("Post ID")
      .messages({ "string.pattern.base": "Invalid user id" }),
    title: Joi.string().required().label("Title"),
    image: Joi.string().empty("").label("Image"),
    description: Joi.string().required().label("Description"),
  });

  let validateResult = schema.validate(request);

  if (validateResult.error) {
    return res
      .status(400)
      .send(ApiResponse.getError(validateResult.error.details[0].message));
  }

  let post = await postModal.findByIdAndUpdate(
    { _id: postId },
    {
      $set: request,
    },
    { new: true }
  );

  let returnObject = post.toJSON();

  if (post) {
    return res.status(200).json(
      ApiResponse.getSuccess({
        details: returnObject,
      })
    );
  }
};

exports.deletePost = async function (req, res) {
  postModal.findByIdAndRemove(req.params.id).exec((err, deletedPost) => {
    if (err) {
      return res.status(400).json({ message: "Not deleted", err });
    }
    return res.json(
      ApiResponse.getSuccess({
        details: deletedPost,
      })
    );
  });
};
