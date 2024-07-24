import express from "express";
import { throwQuery, pool } from "../psqlPool.js";

const router = express.Router();

let query = {};

router.post("/", async (req, res) => {
  const data = req.body;
  query = {
    text: `
    INSERT INTO dxwg_category (name, sort_key)
    VALUES ($1, $2);
  `,
    values: [data.name, data.sort_key],
  };
  await throwQuery(res, query);
});

router.put("/", async (req, res) => {
  const data = req.body;
  query = {
    text: `
      UPDATE dxwg_category
      SET name = $2
      WHERE id = $1;  
      `,
    values: [data.id, data.name],
  };
  await throwQuery(res, query);
});

router.put("/multi", async (req, res) => {
  const items = req.body;
  for (const item of items) {
    query = {
      text: `
      UPDATE dxwg_category
      SET sort_key = $2 ,name = $3
      WHERE id = $1
      `,
      values: [item.id, item.new_id, item.name],
    };
    await throwQuery(res, query);
  }
  query = {
    text: `SELECT * FROM dxwg_category ORDER BY sort_key`,
  };
  await throwQuery(res, query);
});

router.get("/", async (req, res) => {
  query = {
    text: `SELECT * FROM dxwg_category ORDER BY sort_key`,
  };
  await throwQuery(res, query);
});

router.delete("/", async (req, res) => {
  const id = req.query.id;
  query = {
    text: `DELETE FROM dxwg_category WHERE id = $1`,
    values: [id],
  };
  await throwQuery(res, query);
});

export default router;
