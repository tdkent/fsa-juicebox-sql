const {
  client,
  getAllUsers,
  createUser,
  updateUser,
  createPost,
  updatePost,
  getAllPosts,
  getPostsByUser,
  getUserById,
  addTagsToPost,
  createTags,
  getPostsByTagName
} = require("./index");

const dropTables = async () => {
  try {
    console.log("Beginning to drop tables...");
    await client.query(`
      DROP TABLE IF EXISTS post_tags;
      DROP TABLE IF EXISTS posts;
      DROP TABLE IF EXISTS users;
      DROP TABLE IF EXISTS tags;
    `);
    console.log("Finished dropping tables");
  } catch (error) {
    console.error("There was an error while dropping tables");
    throw error;
  }
};

const createTables = async () => {
  try {
    console.log("Starting to build fresh tables...");
    await client.query(`
    CREATE TABLE users (
      id SERIAL PRIMARY KEY,
      username varchar(255) UNIQUE NOT NULL,
      password varchar(255) NOT NULL,
      name varchar(255) NOT NULL,
      location varchar(255) NOT NULL,
      active BOOLEAN DEFAULT true
    );
    CREATE TABLE posts (
      id SERIAL PRIMARY KEY,
      "authorId" INTEGER REFERENCES users(id) NOT NULL,
      title varchar(255) NOT NULL,
      content TEXT NOT NULL,
      active BOOLEAN DEFAULT true
    );
    CREATE TABLE tags (
        id SERIAL PRIMARY KEY,
        name varchar(255) UNIQUE NOT NULL
    );
    CREATE TABLE post_tags (
      "postId" INTEGER REFERENCES posts(id),
      "tagId" INTEGER REFERENCES tags(id),
      UNIQUE ("postId", "tagId")
    );
  `);
    console.log("Finished building new users and posts tables");
  } catch (error) {
    console.error("There was an error while building new tables.");
    throw error;
  }
};

const createInitialUsers = async () => {
  try {
    console.log("Creating initital users...");
    const sibelius = await createUser({
      username: "jean",
      password: "sibelius1865",
      name: "Jean Sibelius",
      location: "Finland",
    });
    const beethoven = await createUser({
      username: "ludwig",
      password: "beethoven1770",
      name: "Ludwig van Beethoven",
      location: "Germany",
    });
    const bartok = await createUser({
      username: "bela",
      password: "bartok1881",
      name: "Bela Bartok",
      location: "Hungary",
    });
    console.log("Finished creating new users.");
  } catch (error) {
    console.error("There was an error while creating users", error);
  }
};

const createInitialPosts = async () => {
  try {
    const [sibelius, beethoven, bartok] = await getAllUsers();

    await createPost({
      authorId: sibelius.id,
      title: "First Post",
      content: "Today I saw the swans...",
      tags: ["#happy", "#youcandoanything"],
    });
    await createPost({
      authorId: beethoven.id,
      title: "First post",
      content: "Some interesting things",
      tags: ["#happy", "#worst-day-ever"],
    });
    await createPost({
      authorId: bartok.id,
      title: "My first post",
      content: "Musical thoughts",
      tags: ["#happy", "#youcandoanything", "#canmandoeverything"],
    });
  } catch (error) {
    throw error;
  }
};

const rebuildDB = async () => {
  try {
    client.connect();
    await dropTables();
    await createTables();
    await createInitialUsers();
    await createInitialPosts();
  } catch (error) {
    throw error;
  }
};

const testDatabase = async () => {
  try {
    console.log("Beginning database testing...");
    const users = await getAllUsers();
    console.log("Here is a list of users: ", users);

    console.log("Now updating users[0] with updateUser function.");
    const updateUserResult = await updateUser(users[0].id, {
      name: "Claude Debussy",
      location: "France",
    });
    console.log("Here is the result of the update: ", updateUserResult);

    console.log("Calling getAllPosts");
    const posts = await getAllPosts();
    console.log("Results of getAllPosts: ", posts);

    console.log("Calling updatePost on posts[0");
    const updatePostResult = await updatePost(posts[0].id, {
      title: "New Title",
      content: "Updated Content",
    });
    console.log("Result of updating the post: ", updatePostResult);

    console.log("Calling updatePost on posts[1], only updating tags");
    const updatePostTagsResult = await updatePost(posts[1].id, {
      tags: ["#youcandoanything", "#redfish", "#bluefish"],
    });
    console.log("Result:", updatePostTagsResult);
    
    console.log("Calling getPostsByTagName with #happy");
    const postsWithHappy = await getPostsByTagName("#happy");
    console.log("Result:", postsWithHappy);

    console.log("Calling getUserById with 1");
    const sibelius = await getUserById(1);
    console.log("Result: ", sibelius);

    console.log("Finished testing the database.");
  } catch (error) {
    console.error("There was an error testing the database: ", error);
  }
};

rebuildDB()
  .then(testDatabase)
  .catch(console.error)
  .finally(() => {
    client.end();
  });