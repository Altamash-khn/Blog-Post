const express = require("express");
const db = require("../data/database");
const router = express.Router();

router.get("/", (req, res) => {
  res.redirect("posts");
});

router.get("/posts", async (req, res) => {
  const query = `
    select posts.*, authors.name as author_name from blog.posts 
    inner join authors on blog.posts.author_id = blog.authors.id
  `;
  const [posts] = await db.query(query);

  res.render("posts-list", { posts: posts });
});

router.get("/posts/:id", async function (req, res) {
  const query = `
    select posts.*, authors.name as author_name, authors.email as author_email from blog.posts 
    inner join blog.authors on posts.author_id = authors.id
    where posts.id = ?
  `;
  const [posts] = await db.query(query, [req.params.id]);

  if (!posts || posts.length === 0) {
    return res.status(404).render("404");
  }

  const postData = {
    ...posts[0],
    date: posts[0].date.toISOString(),
    humanReadableDate: posts[0].date.toLocaleString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
    }),
  };

  res.render("post-detail", { post: postData });
});

router.get("/posts/:id/edit", async function (req, res) {
  const query = `select * from blog.posts where id = ?`;
  const [results] = await db.query(query, [req.params.id]);

  if (!results || results.length === 0) {
    return res.status(404).render("404");
  }

  res.render("update-post", { post: results[0] });
});

router.post("/posts/:id/edit", async function (req, res) {
  const query = `
    UPDATE blog.posts SET title = ?, summary = ?, body = ? 
    where id = ?
  `;
  await db.query(query, [
    req.body.title,
    req.body.summary,
    req.body.content,
    req.params.id,
  ]);
  res.redirect("/posts");
});

router.post("/posts/:id/delete", async function (req, res) {
  await db.query("delete from blog.posts where id = ?", [req.params.id]);

  res.redirect("/posts");
});

router.get("/new-post", async (req, res) => {
  const [authors] = await db.query("select * from authors");
  res.render("create-post", { authors: authors });
});

router.post("/post", function (req, res) {
  const data = [
    req.body.title,
    req.body.summary,
    req.body.content,
    req.body.author,
  ];

  db.query("INSERT INTO posts (title, summary, body, author_id) VALUES (?)", [
    data,
  ]);
  res.redirect("posts");
});

module.exports = router;
