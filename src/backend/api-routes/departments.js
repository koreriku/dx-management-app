import express from "express";
import { throwQuery, throwQueryNoRes } from "../psqlPool.js";

const router = express.Router();

let query = {};

// 部門取得API。toを降順にして取得しないと部署一覧のtoggleが正しく表示されない仕様
router.get("/", async (req, res) => {
  query = {
    text: `select * from Departments order by division asc , "to" desc`,
  };
  throwQuery(res, query);
});

// 部門更新
router.put("/", async (req, res) => {
  const data = req.body;
  query = {
    text: `UPDATE departments 
    SET (name, division, "from", "to")
    = ($1, $2, $3, $4)
    WHERE id = ${data.id}`,
    values: [data.name, data.division, data.from, data.to],
  };
  throwQuery(res, query);
});

// 部門登録
router.post("/", async (req, res) => {
  const data = req.body;
  query = {
    text: `INSERT INTO departments 
    (name, division, "from", "to")
    VALUES ($1, $2, $3, $4)`,
    values: [data.name, data.division, data.from, data.to],
  };
  throwQuery(res, query);
});

export default router;
