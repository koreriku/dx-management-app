import client from "./psqlClient.js";
import departments from "./previousDepaertment.js";

client.connect();

let query = {};
for (let department of departments) {
  query = {
    text: `INSERT INTO departments (name,division,"from","to") VALUES ($1,$2,$3,$4)`,
    values: [
      department.name,
      department.division,
      department.from,
      department.to,
    ],
  };

  client
    .query(query)
    .then((res) => {
      console.log(res.rows);
    })
    .catch((e) => {
      console.error(e.stack);
      client.end();
    });
}
