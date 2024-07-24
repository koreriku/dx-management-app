import express from "express";
import { pool, upload, throwQuery, insideDxFilePath } from "../psqlPool.js";
import { promises as fs } from "fs";

const router = express.Router();

let query = {};
let allColumnName = "";

router.get("/", (req, res) => {
  if (Object.keys(req.query).length > 0) {
    query = {
      text: `select *
      from dxlists
      order by ${req.query.key} ${req.query.sequence} ,id desc;`,
    };
  } else {
    query = {
      text: `select *
      from dxlists
       order by cast(update_date as date) desc,cast(registration_date as date) desc ,id desc;`,
    };
  }
  throwQuery(res, query);
});

router.post("/", (req, res) => {
  const data = req.body;
  query = {
    text: `
          INSERT INTO dxlists
          (registration_date, update_date, changer, department, work, support_tool, 
           state, staff, expected_effect, effect, product, industry, technology, 
           technical_details, customer, cooperation_destination, sales_strategy, note, attached_file, comment, division)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21)
        `,
    values: [
      data.registration_date,
      data.update_date,
      data.changer,
      data.department,
      data.work,
      data.support_tool,
      data.state,
      data.staff,
      data.expected_effect,
      data.effect,
      data.product,
      data.industry,
      data.technology,
      data.technical_details,
      data.customer,
      data.cooperation_destination,
      data.sales_strategy,
      data.note,
      data.attached_file,
      data.comment,
      data.division,
    ],
  };
  throwQuery(res, query);
});

router.post("/upload", upload.single("file"), function (req, res, next) {
  res.send("ファイルのアップロードが完了しました。");
});

router.put("/", (req, res) => {
  const data = req.body;
  if (data.attached_file[0]) {
    query = {
      text: `UPDATE dxlists 
      SET (registration_date, update_date, changer, department, work, support_tool, state,
         staff, expected_effect, effect,product, industry, technology, technical_details, customer, 
         cooperation_destination, sales_strategy, note, attached_file, comment)
      = ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20)
      WHERE id = ${data.id}`,
      values: [
        data.registration_date,
        data.update_date,
        data.changer,
        data.department,
        data.work,
        data.support_tool,
        data.state,
        data.staff,
        data.expected_effect,
        data.effect,
        data.product,
        data.industry,
        data.technology,
        data.technical_details,
        data.customer,
        data.cooperation_destination,
        data.sales_strategy,
        data.note,
        data.attached_file,
        data.comment,
      ],
    };
  } else {
    query = {
      text: `UPDATE dxlists 
      SET (registration_date, update_date, changer, department, work, support_tool, state,
        staff, expected_effect, effect,product, industry, technology, technical_details, customer, 
        cooperation_destination, sales_strategy, note, comment)
     = ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19)
      WHERE id = ${data.id}`,
      values: [
        data.registration_date,
        data.update_date,
        data.changer,
        data.department,
        data.work,
        data.support_tool,
        data.state,
        data.staff,
        data.expected_effect,
        data.effect,
        data.product,
        data.industry,
        data.technology,
        data.technical_details,
        data.customer,
        data.cooperation_destination,
        data.sales_strategy,
        data.note,
        data.comment,
      ],
    };
  }
  throwQuery(res, query);
});

router.put("/changeComment", (req, res) => {
  const data = req.body;
  query = {
    text: `UPDATE dxlists SET comment = $1 WHERE id = $2`,
    values: [data.comment, data.id],
  };
  throwQuery(res, query);
});

function isJSON(str) {
  try {
    JSON.parse(str);
    return true;
  } catch (error) {
    return false;
  }
}

router.put("/deleteFile", (req, res) => {
  const data = req.body;
  if (data.item) {
    query = {
      text: `UPDATE dxlists SET attached_file = $1 WHERE id = $2`,
      values: [data.item.attached_file, data.item.id],
    };
    throwQuery(res, query);
  }

  if (data.file) {
    let fileName = "";
    if (isJSON(data.file)) {
      fileName = JSON.parse(data.file).name;
    } else {
      fileName = data.file.name;
    }

    // try {
    //   fs.unlink(insideDxFilePath + "/" + fileName);
    // } catch (e) {
    //   console.log("ファイルの削除中にエラーが発生しました:", e);
    // }
    (async () => {
      try {
        await fs.unlink(insideDxFilePath + "/" + fileName);
        console.log("ファイルの削除に成功しました");
      } catch (error) {
        console.error("ファイルの削除中にエラーが発生しました:", error);
      }
    })();
  }
});

router.delete("/:id", (req, res) => {
  const id = req.params.id;
  query = {
    text: `delete from dxlists
          where id = ${id}
    `,
  };
  throwQuery(res, query);
});

export default router;
