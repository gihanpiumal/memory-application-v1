const express = require("express");
let auth = require("../services/auth_service");
const router = express.Router();

const userAPI = require("../controllers/userRoute");
const postAPI = require("../controllers/post");

/////////////////////////////////// USER API ////////////////////////////////////////////

router.post("/api/user/new/add", userAPI.addUser); // add new user

router.post("/api/user/get_all", auth, userAPI.getUser); // get all user

router.put("/api/user/update/:id", auth, userAPI.updateUser); // update user user

router.delete("/api/user/delete/:id", auth, userAPI.deleteUser); // delete user user

router.post("/api/user/login", userAPI.loging); // login

router.post("/api/user/reset_password", userAPI.sendOtp); // delete user user

//////////////////////////////////////// POST API //////////////////////////////////

router.post("/api/post/new/add",auth, postAPI.addPost); // add new post

router.post("/api/post/get_all", auth, postAPI.getPosts); // get all posts

router.put("/api/post/update/:id", auth, postAPI.updatePost); // update post

router.delete("/api/post/delete/:id", auth, postAPI.deletePost); // delete post

module.exports = router;
