import express from "express";
import {
  pool,
  upload,
  throwQuery,
  throwQueryNoRes,
  insideDxFilePath,
} from "../psqlPool.js";
import { promises as fs } from "fs";

const router = express.Router();

let query = {};
let result = "";

router.get("/", (req, res) => {
  if (Object.keys(req.query).length > 0) {
    query = {
      text: `select *
      from insidedxlists
      order by ${req.query.key} ${req.query.sequence} ,id desc;`,
    };
  } else {
    query = {
      text: `select *
      from insidedxlists
       order by cast(update_date as date) desc,cast(registration_date as date) desc ,id desc;`,
    };
  }
  throwQuery(res, query);
});

router.post("/", (req, res) => {
  const data = req.body;
  query = {
    text: `
          INSERT INTO insidedxLists
          (registration_date, update_date, changer, department, work, support_tool, state, staff, expected_effect, effect, attached_file, comment)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
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
      data.attached_file,
      data.comment,
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
      text: `UPDATE insidedxLists 
      SET (id, registration_date, update_date, changer, department, work, support_tool, state, staff, expected_effect, effect, attached_file, comment)
      = ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
      WHERE id = ${data.id}`,
      values: [
        data.id,
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
        data.attached_file,
        data.comment,
      ],
    };
  } else {
    query = {
      text: `UPDATE insidedxLists 
      SET (id, registration_date, update_date, changer, department, work, support_tool, state, staff, expected_effect, effect, comment)
      = ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
      WHERE id = ${data.id}`,
      values: [
        data.id,
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
        data.comment,
      ],
    };
  }
  throwQueryNoRes(res, query);
});

router.put("/changeComment", (req, res) => {
  const data = req.body;
  query = {
    text: `UPDATE insidedxlists SET comment = $1 WHERE id = $2`,
    values: [data.comment, data.id],
  };
  throwQueryNoRes(res, query);
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
      text: `UPDATE insidedxlists SET attached_file = $1 WHERE id = $2`,
      values: [data.item.attached_file, data.item.id],
    };
    throwQueryNoRes(res, query);
  }
  if (data.file) {
    let fileName = "";
    if (isJSON(data.file)) {
      fileName = JSON.parse(data.file).name;
    } else {
      fileName = data.file.name;
    }

    fs.unlink(insideDxFilePath + "/" + fileName);
  }
});

router.delete("/:id", (req, res) => {
  const id = req.params.id;
  query = {
    text: `delete from insidedxLists
          where id = ${id}
    `,
  };
  throwQueryNoRes(res, query);
});

export default router;
