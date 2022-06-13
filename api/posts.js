const express = require("express");
const postsRouter = express.Router();

const { getAllPosts, createPost, updatePost, getPostById } = require("../db");
const { requireUser } = require("./utils");

postsRouter.use((req, res, next) => {
  console.log("A request is being made to /posts");
  next();
});

postsRouter.get("/", async (req, res) => {
  try {
    const posts = await getAllPosts();
    const filterInactivePosts = posts.filter((post) => {
      return (
        post.active || (req.user && post.author.id === req.user.rows[0].id)
      );
    });
    res.send({ filterInactivePosts });
  } catch (error) {
    throw error;
  }
});

postsRouter.post("/", requireUser, async (req, res, next) => {
  const { title, content, tags = "" } = req.body;
  const tagArr = tags.trim().split(/\s+/);
  const postData = {};

  if (tagArr.length) {
    postData.tags = tagArr;
  }

  try {
    
    postData.authorId = req.user.rows[0].id;
    postData.title = req.body.title;
    postData.content = req.body.content;
    
    const post = await createPost(postData);
    console.log("data from newly created post: ", post);
    res.send({ post });
  } catch ({ name, message }) {
    next({ name, message });
  }
});

postsRouter.patch("/:postId", requireUser, async (req, res, next) => {
  const { postId } = req.params;
  const { title, content, tags } = req.body;

  const updateFields = {};

  if (tags && tags.length > 0) {
    updateFields.tags = tags.trim().split(/\s+/);
  }
  if (title) {
    updateFields.title = title;
  }
  if (content) {
    updateFields.content = content;
  }

  try {
    const originalPost = await getPostById(postId);
    // console.log("Patch request originalPost.author.id", originalPost.author.id);
    // console.log("req.user: ", req.user.rows[0].id);
    // console.log("req.params: ", req.params);
    // console.log("req.body: ", req.body);
    if (originalPost.author.id === req.user.rows[0].id) {
      const updatedPost = await updatePost(postId, updateFields);
      res.send({ post: updatedPost });
    } else {
      next({
        name: "UnauthorizedUserError",
        message: "You cannot update a post that is not yours",
      });
    }
  } catch ({ name, message }) {
    next({ name, message });
  }
});

postsRouter.delete("/:postId", requireUser, async (req, res, next) => {
  try {
    
    const post = await getPostById(req.params.postId);
    console.log("delete post data: ", post);
    if (post && post.author.id === req.user.rows[0].id) {
      const updatedPost = await updatePost(post.id, { active: false });
      res.send({ post: updatedPost });
    } else {
      next(
        post
          ? {
              name: "UnauthorizedUserError",
              message: "You cannot delete a post which is not yours",
            }
          : {
              name: "PostNotFoundError",
              message: "That post does not exist",
            }
      );
    }
  } catch ({ name, message }) {
    next({ name, message });
  }
});

module.exports = postsRouter;
