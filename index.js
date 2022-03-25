const axios = require("axios");
const { nanoid } = require("nanoid");
const express = require("express");
const demoLinkedList = express();

demoLinkedList.use(express.json());

demoLinkedList.post("/posts", async (req, res) => {
  console.log("ffffff", await axios.get("http://localhost:3000/posts"));
  const { data } = await axios.get("http://localhost:3000/posts");
  const newId = nanoid(10);
  let previousPostId = null;
  if (data.length) {
    previousPostId = data[data.length - 1].id;
  }
  if (previousPostId !== null) {
    await axios.patch(`http://localhost:3000/posts/${previousPostId}`, {
      nextPostId: newId,
    });
  }
  const newPost = {
    previousPostId: previousPostId,
    id: newId,
    body: "Test body " + newId,
    nextPostId: null,
    created_at: new Date(),
  };
  await axios.post("http://localhost:3000/posts", newPost);
  res.send("Successfully added");
});

demoLinkedList.get("/posts", async (req, res) => {
  const posts = await axios.get("http://localhost:3000/posts");
  res.send(posts.data);
});

demoLinkedList.get("/posts/:id", async (req, res) => {
  const post = await axios.get(`http://localhost:3000/posts/${req.params.id}`);
  res.send(post.data);
});

demoLinkedList.delete("/posts/:id", async (req, res) => {
  const { data: post } = await axios.get(
    `http://localhost:3000/posts/${req.params.id}`
  );
  if (post.previousPostId !== null)
    await axios.patch(`http://localhost:3000/posts/${post.previousPostId}`, {
      nextPostId: post.nextPostId,
    });
  if (post.nextPostId !== null)
    await axios.patch(`http://localhost:3000/posts/${post.nextPostId}`, {
      previousPostId: post.previousPostId,
    });
  await axios.delete(`http://localhost:3000/posts/${req.params.id}`);
  res.send("deleted");
});

demoLinkedList.post("/posts/:id", async (req, res) => {
  console.log("sss", req.params.id);
  // console.log("ffffff", await axios.get("http://localhost:3000/posts"));
  // const { data } = await axios.get("http://localhost:3000/posts");
  // const newId = nanoid(10);
  // let previousPostId = null;
  // if (data.length) {
  //   previousPostId = data[data.length - 1].id;
  // }
  // if (previousPostId !== null) {
  //   await axios.patch(`http://localhost:3000/posts/${previousPostId}`, {
  //     nextPostId: newId,
  //   });
  // }
  // const newPost = {
  //   previousPostId: previousPostId,
  //   id: newId,
  //   body: "Test body " + newId,
  //   nextPostId: null,
  //   created_at: new Date(),
  // };
  // await axios.post("http://localhost:3000/posts", newPost);
  res.send("Successfully added");
});

demoLinkedList.listen(3001, console.log("connected at http://localhost:3001"));
