import {
  pool,
  upload,
  throwQuery,
  throwQueryNoRes,
  insideDxFilePath,
} from "../psqlPool.js";
import items from "./dxwgPreviousData.js";
import axios from "axios";
import states from "../../frontend/json/dxWgState.json" assert { type: "json" };
// import industries from "../../json/outsideDxIndustry.json" assert { type: "json" };
// import states from "../../json/outsideDxState.json" assert { type: "json" };
// import technologies from "../../json/outsideDxTechnology.json" assert { type: "json" };

let departments = [];
let categories = [];
let query = {};

// dxWg
const dxWgBASE_URL = "http://localhost:8000/dxWg";
// dxWgカテゴリー
const dxWgCategoryBASE_URL = "http://localhost:8000/dxWgCategory";

// 部署テーブルデータ取得
query = {
  text: "select * from Departments order by id asc",
};
await pool
  .query(query)
  .then((result) => {
    departments = result.rows;
  })
  .catch((e) => {
    console.log(e.stack);
  });

// カテゴリー取得
query = {
  text: "select * from dxwg_category order by id asc",
};
await pool
  .query(query)
  .then((result) => {
    categories = result.rows;
  })
  .catch((e) => {
    console.log(e.stack);
  });

for (let data of items) {
  let isData = false;
  if (data.category) {
    console.log(data.category);
    for (const category of categories) {
      if (category.name == data.category.replaceAll(" ", "")) {
        data.category = [category.id];
        isData = true;
        break;
      }
    }
  }
  if (!isData) {
    data.category = [];
  }
  if (data.priority == "●") {
    data.priority = true;
  } else {
    data.priority = false;
  }
  let isState = false;
  // ステータス番号を取得
  if (data.state) {
    for (let item of states) {
      if (item.state === data.state.replaceAll(" ", "")) {
        data.state = item.id;
        isState = true;
        break;
      }
    }
  }
  if (!isState) {
    data.state = 1;
  }
  isData = false;
  if (data.support_department) {
    let dsArray = [];
    let ds = data.support_department.split("＋");
    for (const d of ds) {
      for (const department of departments) {
        if (department.name == d.replaceAll(" ", "")) {
          dsArray.push(department.id);
          isData = true;
          break;
        }
      }
    }
    data.support_department = dsArray;
  }
  if (!isData) {
    data.support_department = [];
  }
  data.draft_department = [];
  if (data.registration_date) {
    data.registration_date = data.registration_date.substr(0, 10);
  }
  if (data.update_date) {
    data.update_date = data.update_date.substr(0, 10);
  }

  // クエリ作成
  query = {
    text: `
          INSERT INTO dxwg
          (id, category, draft_content, draft_business_sector , draft_department , priority , state , 
            support_department , staff, support_content , deadline , one_q_progress , two_q_progress , three_q_progress , 
            four_q_progress , result , effect , effect_comment , registration_date , update_date , support_update_date , effect_update_date ,
            attached_file ,comment )
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24)
        `,
    values: [
      data.id,
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
      [],
      [],
    ],
  };
  pool
    .query(query)
    .then((result) => {})
    .catch((e) => {
      console.log(e.stack);
    });

  // // 日のフォーマット変更
  // let parts = data.registration_date.split("/");
  // let year = parts[0];
  // let month = ("0" + parts[1]).slice(-2);
  // let day = ("0" + parts[2]).slice(-2);
  // let registration_date = year + "-" + month + "-" + day;

  // let update_date;
  // if (data.update_date) {
  //   parts = data.update_date.split("/");
  //   year = parts[0];
  //   month = ("0" + parts[1]).slice(-2);
  //   day = ("0" + parts[2]).slice(-2);
  //   update_date = year + "-" + month + "-" + day;
  // } else {
  //   update_date = registration_date;
  // }

  // // 部署番号を取得
  // for (let department of departments) {
  //   if (department.name === data.department) {
  //     data.department = department.id;
  //     break;
  //   }
  // }

  // // 効果番号を取得
  // for (let industry of industries) {
  //   if (industry.industry === data.industry) {
  //     data.industry = industry.id;
  //     break;
  //   }
  // }
  // // 状況番号を取得
  // for (let state of states) {
  //   if (state.state === data.state) {
  //     data.state = state.id;
  //     break;
  //   }
  // }

  // // 効果番号を取得
  // let technologyNums = [];
  // for (let item of data.technology.split(",")) {
  //   let beTechnology = false;
  //   for (let technology of technologies) {
  //     if (item === technology.technology) {
  //       technologyNums.push(Number(technology.id));
  //       beTechnology = true;
  //       break;
  //     }
  //   }
  //   if (!beTechnology) {
  //     technologyNums.push(item);
  //   }
  // }
  // data.technology = technologyNums;

  // query = {
  //   text: `
  //         INSERT INTO dxLists
  //         (department, product, industry, technology, technical_details, state, customer,
  //           cooperation_destination, sales_strategy, note, registration_date, update_date,
  //           changer,attached_file,comment,division)
  //         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12,$13,$14,$15,$16)
  //       `,
  //   values: [
  //     data.department,
  //     data.product,
  //     data.industry,
  //     data.technology,
  //     data.technical_details,
  //     data.state,
  //     data.customer,
  //     data.cooperation_destination,
  //     data.sales_strategy,
  //     data.note,
  //     registration_date,
  //     update_date,
  //     data.changer,
  //     [],
  //     [],
  //     false,
  //   ],
  // };

  // client
  //   .query(query)
  //   .then((res) => {
  //     console.log(res.rows);
  //     //   client.end();
  //   })
  //   .catch((e) => {
  //     console.error(e.stack);
  //     client.end();
  //   });
}
