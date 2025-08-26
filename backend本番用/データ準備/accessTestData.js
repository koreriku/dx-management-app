import axios from "axios";
import https from "https";

const agent = new https.Agent({
  rejectUnauthorized: false, // SSL証明書の検証を無効化
});

const start = performance.now();

// GO;
// axios.get("http://localhost:8080/tasks_sql").then((res) => {
//   console.log(res.data.length);
//   const end = performance.now();
//   const elapsed = end - start;
//   const elapsedStr = elapsed.toPrecision(3);
//   console.log(`かかった時間：${elapsedStr}`);
// });

// express
// axios.get("http://localhost:3000").then((res) => {
//   console.log(res.data.length);
//   const end = performance.now();
//   const elapsed = end - start;
//   const elapsedStr = elapsed.toPrecision(3);
//   console.log(`かかった時間：${elapsedStr}`);
// });

// C#
// axios
//   .get("https://localhost:7120/test/all", { httpsAgent: agent })
//   .then((res) => {
//     console.log(res.data.length);
//     const end = performance.now();
//     const elapsed = end - start;
//     const elapsedStr = elapsed.toPrecision(3);
//     console.log(`かかった時間：${elapsedStr}`);
//   });

// JAVA
axios
  .get("http://localhost:8080/Test/All", { httpsAgent: agent })
  .then((res) => {
    console.log(res.data.length);
    const end = performance.now();
    const elapsed = end - start;
    const elapsedStr = elapsed.toPrecision(3);
    console.log(`かかった時間：${elapsedStr}`);
  });
