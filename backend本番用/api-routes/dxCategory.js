import express from "express";
import { throwQuery, throwQueryNoRes, pool } from "../psqlPool.js";

const router = express.Router();

let query = {};

router.post("/", async (req, res) => {
  const data = req.body;
  query = {
    text: `
    INSERT INTO dx_category (name, sort_key)
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
      UPDATE dx_category
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
      UPDATE dx_category
      SET sort_key = $2 ,name = $3
      WHERE id = $1
      `,
      values: [item.id, item.new_id, item.name],
    };
    await throwQueryNoRes(res, query);
    if (res.headersSent) {
      // いずれかの更新でエラーが発生し、throwQueryNoRes内で既に500レスポンス済みのため、
      // ループを打ち切り末尾のSELECTによる二重レスポンスを防ぐ
      return;
    }
  }
  query = {
    text: `SELECT * FROM dx_category ORDER BY sort_key`,
  };
  await throwQuery(res, query);
});

router.get("/", async (req, res) => {
  query = {
    text: `SELECT * FROM dx_category ORDER BY sort_key`,
  };
  await throwQuery(res, query);
});

router.delete("/", async (req, res) => {
  const id = req.query.id;
  try {
    const usage = await pool.query(
      `SELECT COUNT(*) FROM dxlists WHERE category IS NOT NULL AND $1 = ANY(category)`,
      [id]
    );
    if (Number(usage.rows[0].count) > 0) {
      res.status(409).send("このカテゴリーは使用されているため削除できません。");
      return;
    }
  } catch (e) {
    console.log(e.stack);
    res.status(500).send("An error occurred");
    return;
  }
  query = {
    text: `DELETE FROM dx_category WHERE id = $1`,
    values: [id],
  };
  await throwQuery(res, query);
});

export default router;
