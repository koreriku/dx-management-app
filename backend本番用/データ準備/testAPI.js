import client from "./psqlClient.js";

import express from "express";
const app = express();
let query = {};

// GETリクエスト
app.get("/", (req, res) => {
  query = {
    text: `
          SELECT *
          FROM tasks
          `,
  };
  client
    .query(query)
    .then((result) => {
      res.send(result.rows);
    })
    .catch((e) => {
      console.error(e.stack);
    });
  //   res.send({
  //     msg: "POST request",
  //   });
});

// POSTリクエスト
app.post("/", (req, res) => {
  res.send({
    msg: "POST request",
  });
});

// PUTリクエスト
app.put("/:id", (req, res) => {
  res.send({
    id: req.params.id,
    msg: "PUT request",
  });
});

// DELETEリクエスト
app.delete("/:id", (req, res) => {
  res.send({
    id: req.params.id,
    msg: "DELETE request",
  });
});

app.listen(3000, () => {
  console.log("Server started on port 3000");
});
