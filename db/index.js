const { Client } = require("pg");

const client = new Client("postgres://localhost:5432/juicebox-dev");

const getAllUsers = async () => {
  const { rows } = await client.query(
    `SELECT id, username, password, name, location, active FROM users;`
  );
  return rows;
};

const getUsersByUsername = async (username) => {
  try {
    const {
      rows: [user],
    } = await client.query(
      `
      SELECT * FROM users
      WHERE username = $1;
    `,
      [username]
    );
    return user;
  } catch (error) {
    throw error;
  }
};

async function getAllPosts() {
  try {
    const { rows: postIds } = await client.query(`
      SELECT id
      FROM posts;
    `);

    const posts = await Promise.all(
      postIds.map((post) => getPostById(post.id))
    );

    return posts;
  } catch (error) {
    throw error;
  }
}

const getAllTags = async () => {
  try {
    const { rows } = await client.query(`
      SELECT * FROM tags;
    `);
    return rows;
  } catch (error) {
    throw error;
  }
};

async function getPostsByUser(userId) {
  try {
    const { rows: postIds } = await client.query(`
      SELECT id 
      FROM posts 
      WHERE "authorId"=${userId};
    `);

    const posts = await Promise.all(
      postIds.map((post) => getPostById(post.id))
    );

    return posts;
  } catch (error) {
    throw error;
  }
}

const createUser = async ({ username, password, name, location }) => {
  try {
    const {
      rows: [user],
    } = await client.query(
      `
    INSERT INTO users(username, password, name, location)
    VALUES ($1, $2, $3, $4)
    ON CONFLICT (username) DO NOTHING
    RETURNING id, username, password, name, location;
`,
      [username, password, name, location]
    );
    return user;
  } catch (error) {
    throw error;
  }
};

const getUserById = async (userId) => {
  try {
    const { rows } =
      await client.query(`SELECT id, username, password, name, location, active FROM users
    WHERE id = ${userId}
    `);
    if (rows.length === 0) {
      return;
    } else {
      return { rows };
    }
  } catch (error) {
    throw error;
  }
};

async function createPost({
  authorId,
  title,
  content,
  tags = [],
}) {
  try {
    const {
      rows: [post],
    } = await client.query(
      `
      INSERT INTO posts("authorId", title, content) 
      VALUES($1, $2, $3)
      RETURNING *;
    `,
      [authorId, title, content]
    );

    const tagList = await createTags(tags);

    return await addTagsToPost(post.id, tagList);
  } catch (error) {
    throw error;
  }
}

const createTags = async (tagList) => {
  if (tagList.length === 0) {
    return;
  }
  const insertValues = tagList.map((_, index) => `$${index + 1}`).join("), (");

  const selectValues = tagList.map((_, index) => `$${index + 1}`).join(", ");

  try {
    // console.log("tagList when new post created: ", tagList);
    const insert = `
      INSERT INTO tags(name)
      VALUES (${insertValues})
      ON CONFLICT (name) DO NOTHING;
    `;
    const select = `
      SELECT * FROM tags
      WHERE name IN (${selectValues});
      `;

    await client.query(insert, tagList);

    const { rows } = await client.query(select, tagList);
    // console.log("createTags rows: ", rows);
    return rows;
  } catch (error) {
    throw error;
  }
};

const createPostTag = async (postId, tagId) => {
  try {
    await client.query(
      `
      INSERT INTO post_tags("postId", "tagId")
      VALUES($1, $2)
      ON CONFLICT ("postId", "tagId") DO NOTHING;
    `,
      [postId, tagId]
    );
  } catch (error) {
    throw error;
  }
};

const addTagsToPost = async (postId, tagList) => {
  try {
    // console.log("addTagsToPost tagList: ", tagList);
    const createPostTagPromises = tagList.map((tag) =>
      createPostTag(postId, tag.id)
    );
    // console.log("createPostTagPromises: ", createPostTagPromises);
    await Promise.all(createPostTagPromises);
    return await getPostById(postId);
  } catch (error) {
    throw error;
  }
};

const getPostById = async (postId) => {
  try {
    const {
      rows: [post],
    } = await client.query(
      `
      SELECT * FROM posts WHERE id=$1;
    `,
      [postId]
    );

    if(!post) {
      throw {
        name: "PostNotFoundError",
        message: "Could not find a post with that postId"
      };
    }
    
    const { rows: tags } = await client.query(`
    SELECT tags.*
    FROM tags
    JOIN post_tags ON tags.id=post_tags."tagId"
    WHERE post_tags."postId"=$1;
  `, [postId]);
    // console.log("rows: [tags]: ", { rows: [tags] });
    const {
      rows: [author],
    } = await client.query(
      `
      SELECT id, username, name, location FROM users
      WHERE id=$1;
    `,
      [post.authorId]
    );

    post.tags = tags;
    //console.log("getPostById post.tags: ", post.tags);
    post.author = author;
    delete post.authorId;
    //console.log("getPostById return post: ", post);
    return post;
  } catch (error) {
    throw error;
  }
};

async function getPostsByTagName(tagName) {
  try {
    const { rows: postIds } = await client.query(
      `
      SELECT posts.id
      FROM posts
      JOIN post_tags ON posts.id=post_tags."postId"
      JOIN tags ON tags.id=post_tags."tagId"
      WHERE tags.name=$1;
    `,
      [tagName]
    );

    return await Promise.all(postIds.map((post) => getPostById(post.id)));
  } catch (error) {
    throw error;
  }
}

const updateUser = async (id, fields = {}) => {
  const setString = Object.keys(fields)
    .map((key, index) => `"${key}"=$${index + 1}`)
    .join(", ");
  if (setString.length === 0) {
    return;
  }
  try {
    const {
      rows: [user],
    } = await client.query(
      `
      UPDATE users
      SET ${setString}
      WHERE id=${id}
      RETURNING *;
    `,
      Object.values(fields)
    );
    return user;
  } catch (error) {
    throw error;
  }
};

const updatePost = async (id, fields = {}) => {
  const { tags } = fields;
  delete fields.tags;

  const setString = Object.keys(fields)
    .map((key, index) => `"${key}"=$${index + 1}`)
    .join(", ");

  try {
    if (setString.length > 0) {
      const {
        rows: [post],
      } = await client.query(
        `
      UPDATE posts
      SET ${setString}
      WHERE id=${id}
      RETURNING *;
    `,
        Object.values(fields)
      );
    }
    if (tags === undefined) {
      return await getPostById(id);
    }
    const tagList = await createTags(tags);
    const tagListIdString = tagList.map((tag) => `${tag.id}`).join(", ");

    await client.query(
      `
    DELETE FROM post_tags
    WHERE "tagId" NOT IN (${tagListIdString})
    AND "postId"=$1
    `,
      [id]
    );
    await addTagsToPost(id, tagList);
  } catch (error) {
    throw error;
  }
};

module.exports = {
  client,
  getAllUsers,
  createUser,
  updateUser,
  createPost,
  updatePost,
  getAllPosts,
  getPostsByUser,
  getUserById,
  createTags,
  addTagsToPost,
  getPostsByTagName,
  getAllTags,
  getUsersByUsername,
  getPostById
};
