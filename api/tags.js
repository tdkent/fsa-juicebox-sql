const express = require("express");
const tagsRouter = express.Router();

const { getAllTags, getPostsByTagName } = require("../db");

tagsRouter.use((req, res, next) => {
  console.log("A request is being made to /tags");
  next();
});

tagsRouter.get("/:tagName/posts", async (req, res, next) => {
  const { tagName } = req.params;

  try {
    const taggedPosts = await getPostsByTagName(tagName);
    const filterTaggedPosts = taggedPosts.filter((post) => {
      if (post.active || (req.user && post.author.id === req.user.rows[0].id)) {
        return true;
      } else {
        return false;
      }
    });
    console.log("filterTaggedPosts: ", filterTaggedPosts);
    res.send({ filterTaggedPosts });
  } catch ({ name, message }) {
    name({ name, message });
  }
});

tagsRouter.get("/", async (req, res) => {
  const tags = await getAllTags();
  res.send({ tags });
});

module.exports = tagsRouter;
