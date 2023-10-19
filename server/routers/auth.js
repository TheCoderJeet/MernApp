import express from "express";
const router = express.Router();
import bcrypt from "bcryptjs";

// const express = require("express");
// const bcrypt = require("bcryptjs");

// require("../db/database");
import "../db/database.js";
import User from "../models/userSchema.js";
import Post from "../models/PostSchems.js";
// const User = require("../models/userSchema");
// const Post = require("../models/PostSchems");

router.get("/", (req, res) => {
  res.send(`Hello world from the server rotuer js`);
});

router.get("/allusers", async (req, res) => {
  try {
    const userList = await User.find();
    if (userList) {
      return res.json(userList);
    }
  } catch (error) {
    console.log(error);
  }
});

router.post("/register", async (req, res) => {
  const { name, email, phone, password, cpassword } = req.body;
  if (!name || !email || !phone || !password || !cpassword) {
    return res
      .status(422)
      .json({ error: "Please input requested feilds properly" });
  }
  try {
    const userEx = await User.findOne({ email: email });
    if (userEx) {
      return res.status(422).json({ error: "User exitssss" });
    }
    const user = new User({ name, email, phone, password, cpassword });
    const savedUser = await user.save();
    if (savedUser) {
      res.status(201).json({ error: "User registered successfully!!!" });
    }
  } catch (erro) {
    console.log(error);
  }
});

router.post("/signin", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ error: "Please input requested fields properly" });
    }
    const isUser = await User.findOne({ email });
    if (isUser) {
      const isMatch = await bcrypt.compare(password, isUser.password);
      if (!isMatch) {
        res.status(422).json({ error: "Password not matching!!" });
      } else {
        res.json(isUser);
      }
    } else {
      res.status(422).json({ error: "User does't existsss!!!" });
    }
  } catch (error) {
    console.log(error);
  }
});

router.post("/single", async (req, res) => {
  try {
    const { id } = req.body;
    if (!id) {
      return res
        .status(400)
        .json({ error: "Please input requested feilds properly" });
    }
    const isUser = await User.findOne({ _id: id });

    if (isUser) {
      res.status(422).json(isUser);
    } else {
      res.status(422).json({ error: "User does't existsss!!!" });
    }
  } catch (error) {
    console.log(error);
  }
});

router.post("/updateuser", async (req, res) => {
  const { _id, name, email, phone, password, cpassword } = req.body;
  if (!_id || !name || !email || !phone || !password || !cpassword) {
    return res
      .status(422)
      .json({ error: "Please input requested feilds properly" });
  }
  try {
    const savedUser = await User.updateOne(
      { _id },
      {
        $set: {
          name,
          email,
          phone,
        },
      }
    );
    if (savedUser) {
      res.status(201).json({ error: "User registered successfully!!!" });
    }
  } catch (error) {
    console.log(error);
  }
});

router.post("/deleteuser", async (req, res) => {
  const { _id } = req.body;
  if (!_id) {
    return res
      .status(422)
      .json({ error: "Please input requested feilds properly" });
  }
  try {
    const deleteUser = await User.deleteOne({ _id });
    if (deleteUser) {
      res.status(201).json({ error: "User successfully deleted!!!" });
    }
  } catch (error) {
    console.log(error);
  }
});

router.post("/create-post", async (req, res) => {
  const { userId, title, author, description, thumbnail } = req.body;
  if (!userId || !title || !author || !description || !thumbnail) {
    return res
      .status(422)
      .json({ error: "Please input requested feilds properly" });
  }
  try {
    const post = new Post({
      userId,
      title,
      author,
      description,
      thumbnail,
    });
    const savedPost = await post.save();
    if (savedPost) {
      res.status(201).json({ msg: "Post created successfully!!!" });
    }
  } catch (error) {
    console.log(error);
  }
});

router.post("/updatepost", async (req, res) => {
  const {
    _id,
    userId,
    title,
    author,
    description,
    thumbnail,
    notifications,
    likes,
  } = req.body;
  if (
    !_id ||
    !userId ||
    !title ||
    !author ||
    !description ||
    !thumbnail ||
    !likes
  ) {
    return res
      .status(422)
      .json({ error: "Please input requested feilds properly" });
  }
  try {
    const post = await Post.findOne({ _id });
    if (post) {
      if (post.likes.length > 0) {
        let check = false;
        post.likes.map(async (like, i) => {
          if (likes.userLikeId === like.userLikeId) {
            check = false;
          } else {
            check = true;
          }
        });
        if (check) {
          const updatePost = await Post.findByIdAndUpdate(
            { _id },
            {
              $push: {
                likes,
                notifications: likes,
              },
            }
          );
          res.status(201).json({ msg: "Post updated successfully!!!" });
        }
      } else {
        const updatePost = await Post.findByIdAndUpdate(
          { _id },
          {
            $push: {
              likes,
              notifications: likes,
            },
          }
        );
        res.status(201).json({ msg: "Post updated successfully!!!" });
      }
    }
  } catch (error) {
    // console.log(error);
  }
});

router.get("/allposts", async (req, res) => {
  try {
    const postList = await Post.find();
    if (postList) {
      return res.json(postList);
    }
  } catch (error) {
    console.log(error);
  }
});

router.post("/singlepost", async (req, res) => {
  try {
    const { id } = req.body;
    if (!id) {
      return res
        .status(400)
        .json({ error: "Please input requested feilds properly" });
    }
    const isPost = await Post.findOne({ _id: id });

    if (isPost) {
      res.status(422).json(isPost);
    } else {
      res.status(422).json({ error: "User does't existsss!!!" });
    }
  } catch (error) {
    console.log(error);
  }
});

router.post("/userposts", async (req, res) => {
  try {
    const { id } = req.body;
    if (!id) {
      return res
        .status(400)
        .json({ error: "Please input requested feilds properly" });
    }
    const isPost = await Post.find({ userId: id });

    if (isPost) {
      res.status(422).json(isPost);
    } else {
      res.status(422).json({ error: "User does't existsss!!!" });
    }
  } catch (error) {
    console.log(error);
  }
});

export default router;
