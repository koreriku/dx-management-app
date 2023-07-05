import express from "express";
import { throwQuery, throwQueryNoRes } from "../psqlPool.js";

const router = express.Router();

let query = {};

// 部門取得API。toを降順にして取得しないと部署一覧のtoggleが正しく表示されない仕様
router.get("/", async (req, res) => {
  query = {
    text: `select * from Departments order by division asc , "to" desc`,
  };
  await throwQuery(res, query);
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
  await throwQuery(res, query);
});

// 指定された区分をもつレコードの区分を全て書き換える
// router.put("/changeDivision", async (req, res) => {
//   const data = req.query;
//   console.log(data.destinationDivision);
//   query = {
//     text: `UPDATE departments
//     SET division = $1
//     WHERE division = $2;
//     `,
//     values: [Number(data.destinationDivision), Number(data.startingDivision)],
//   };
//   await throwQueryNoRes(res, query);

//   query = {
//     text: `UPDATE departments
//     SET division = $1
//     WHERE division = $2;
//     `,
//     values: [Number(data.startingDivision), Number(data.destinationDivision)],
//   };
//   await throwQueryNoRes(res, query);
// });

// 部門登録
router.post("/", async (req, res) => {
  const data = req.body;
  query = {
    text: `INSERT INTO departments 
    (name, division, "from", "to")
    VALUES ($1, $2, $3, $4)`,
    values: [data.name, data.division, data.from, data.to],
  };
  await throwQuery(res, query);
});

// 部門コードの最大値を取得
router.get("/maxDivision", async (req, res) => {
  query = {
    text: `select max(division) as maxDivision from departments;`,
  };
  await throwQuery(res, query);
});

// 前の部門コードをもつ部門の部門コードを新しい部門コードに全て書き換える
router.put("/changeDivision", async (req, res) => {
  const data = req.body;
  query = {
    text: `UPDATE departments 
    SET division = $1
    WHERE division = ${req.query.previousDivision} and "to" < $2`,
    values: [data.division, data.to],
  };
  await throwQuery(res, query);
});

export default router;
