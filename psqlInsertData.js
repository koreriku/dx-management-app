import client from "./psqlClient.js";
import datas from "./previousData.js";
import axios from "axios";

client.connect();

let departments = [];
let effects = [];
let states = [];
let query = {};

// 部署テーブルデータ取得
query = {
  text: "select * from Departments order by id asc",
};
await client
  .query(query)
  .then((result) => {
    departments = result.rows;
  })
  .catch((e) => {
    console.log(e.stack);
  });

for (let data of datas) {
  // 日のフォーマット変更
  let parts = data.registrationDate.split("/");
  let year = parts[0];
  let month = ("0" + parts[1]).slice(-2);
  let day = ("0" + parts[2]).slice(-2);
  let registrationDate = year + "-" + month + "-" + day;

  parts = data.updateDate.split("/");
  year = parts[0];
  month = ("0" + parts[1]).slice(-2);
  day = ("0" + parts[2]).slice(-2);
  let updateDate = year + "-" + month + "-" + day;

  // 部署番号を取得
  for (let department of departments) {
    if (department.name === data.department) {
      data.department = department.id;
      break;
    }
  }

  // 効果番号を取得
  if (data.effect === "大") {
    data.effect = 2;
  } else if (data.effect === "中") {
    data.effect = 3;
  } else if (data.effect === "小") {
    data.effect = 4;
  } else {
    data.effect = 1;
  }

  // 状況番号を取得
  if (data.state === "計画・調査中") {
    data.state = 2;
  } else if (data.state === "準備・検証中") {
    data.state = 3;
  } else if (data.state === "運用中") {
    data.state = 4;
  } else if (data.state === "運用見送り") {
    data.state = 5;
  } else {
    data.state = 1;
  }

  query = {
    text: `
          INSERT INTO insidedxLists
          (registration_date, update_date, changer, department, work, support_tool, state, staff, expected_effect, effect, attached_file, comment)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
        `,
    values: [
      registrationDate,
      updateDate,
      data.changer,
      data.department,
      data.work,
      data.supportTool,
      data.state,
      data.staff,
      data.expectedEffect,
      data.effect,
      [],
      data.comment,
    ],
  };

  client
    .query(query)
    .then((res) => {
      console.log(res.rows);
      //   client.end();
    })
    .catch((e) => {
      console.error(e.stack);
      client.end();
    });
}
