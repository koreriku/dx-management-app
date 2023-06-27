import client from "./psqlClient.js";
import items from "./previousOutsideDxData.js";
import axios from "axios";
import industries from "./json/outsideDxIndustry.json" assert { type: "json" };
import states from "./json/outsideDxState.json" assert { type: "json" };
import technologies from "./json/outsideDxTechnology.json" assert { type: "json" };

client.connect();

let departments = [];
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

for (let data of items) {
  // 日のフォーマット変更
  let parts = data.registration_date.split("/");
  let year = parts[0];
  let month = ("0" + parts[1]).slice(-2);
  let day = ("0" + parts[2]).slice(-2);
  let registration_date = year + "-" + month + "-" + day;

  parts = data.update_date.split("/");
  year = parts[0];
  month = ("0" + parts[1]).slice(-2);
  day = ("0" + parts[2]).slice(-2);
  let update_date = year + "-" + month + "-" + day;

  // 部署番号を取得
  for (let department of departments) {
    if (department.name === data.department) {
      data.department = department.id;
      break;
    }
  }

  // 効果番号を取得
  for (let industry of industries) {
    if (industry.industry === data.industry) {
      data.industry = industry.id;
      break;
    }
  }
  // 状況番号を取得
  for (let state of states) {
    if (state.state === data.state) {
      data.state = state.id;
      break;
    }
  }

  // 効果番号を取得
  let technologyNums = [];
  for (let item of data.technology.split(",")) {
    let beTechnology = false;
    for (let technology of technologies) {
      if (item === technology.technology) {
        technologyNums.push(Number(technology.id));
        beTechnology = true;
        break;
      }
    }
    if (!beTechnology) {
      technologyNums.push(item);
    }
  }
  console.log(technologyNums);
  data.technology = technologyNums;

  query = {
    text: `
          INSERT INTO outsidedxLists
          (department, product, industry, technology, technical_details, state, customer, 
            cooperation_destination, sales_strategy, note, registration_date, update_date,
            changer,attached_file,comment)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12,$13,$14,$15)
        `,
    values: [
      data.department,
      data.product,
      data.industry,
      data.technology,
      data.technical_details,
      data.state,
      data.customer,
      data.cooperation_destination,
      data.sales_strategy,
      data.note,
      registration_date,
      update_date,
      data.changer,
      [],
      [],
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
