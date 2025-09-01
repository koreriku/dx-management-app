import express from "express";
import { pool, upload, throwQuery, insideDxFilePath } from "../psqlPool.js";
import { promises as fs } from "fs";

const router = express.Router();

let query = {};

router.get("/id", (req, res) => {
  const id = req.query.id;
  query = {
    text: `select *
    from dxwg 
    where id = $1`,
    values: [id],
  };

  throwQuery(res, query);
});

router.get("/", (req, res) => {
  query = {
    text: `select *
    from dxwg order by update_date desc,id desc;`,
  };

  throwQuery(res, query);
});

router.post("/", async (req, res) => {
  const data = req.body;
  query = {
    text: `SELECT max(id) FROM dxwg`,
  };
  await pool
    .query(query)
    .then((result) => {
      let id = result.rows[0].max + 1;
      query = {
        text: `
              INSERT INTO dxwg
              (id, category, draft_content, draft_business_sector , draft_department , priority , state , 
                support_department , staff, support_content , deadline , one_q_progress , two_q_progress , three_q_progress , 
                four_q_progress , result , effect , effect_comment , registration_date , update_date , support_update_date , effect_update_date ,
                year, attached_file ,comment )
              VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25)
            `,
        values: [
          id,
          data.category,
          data.draft_content,
          data.draft_business_sector,
          data.draft_department,
          data.priority,
          data.state,
          data.support_department,
          data.staff,
          data.support_content,
          data.deadline,
          data.one_q_progress,
          data.two_q_progress,
          data.three_q_progress,
          data.four_q_progress,
          data.result,
          data.effect,
          data.effect_comment,
          data.registration_date,
          data.update_date,
          data.support_update_date,
          data.effect_update_date,
          data.year,
          data.attached_file,
          data.comment,
        ],
      };
      throwQuery(res, query);
    })
    .catch((e) => {
      console.log(e.stack);
      res.status(500).send("An error occurred");
    });
});

router.put("/", (req, res) => {
  const data = req.body;
  query = {
    text: `UPDATE dxwg 
      SET (category, draft_content, draft_business_sector , draft_department , priority , state , 
        support_department , staff, support_content , deadline , one_q_progress , two_q_progress , three_q_progress , 
        four_q_progress , result , effect , effect_comment , registration_date , update_date , support_update_date , effect_update_date ,
        year, attached_file ,comment )
      = ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24)
      WHERE id = ${data.id}`,
    values: [
      data.category,
      data.draft_content,
      data.draft_business_sector,
      data.draft_department,
      data.priority,
      data.state,
      data.support_department,
      data.staff,
      data.support_content,
      data.deadline,
      data.one_q_progress,
      data.two_q_progress,
      data.three_q_progress,
      data.four_q_progress,
      data.result,
      data.effect,
      data.effect_comment,
      data.registration_date,
      data.update_date,
      data.support_update_date,
      data.effect_update_date,
      data.year,
      data.attached_file,
      data.comment,
    ],
  };
  throwQuery(res, query);
});

router.put("/changeComment", (req, res) => {
  const data = req.body;
  query = {
    text: `UPDATE dxwg SET comment = $1 WHERE id = $2`,
    values: [data.comment, data.id],
  };
  throwQuery(res, query);
});

router.delete("/:id", (req, res) => {
  const id = req.params.id;
  query = {
    text: `delete from dxwg
          where id = ${id}
    `,
  };
  throwQuery(res, query);
});

export default router;
