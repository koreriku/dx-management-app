import client from "./psqlClient.js";

client.connect();

let query = {};

for (let i = 1; i < 200000; i++) {
  query = {
    text: `
          INSERT INTO tasks
          (task, is_completed)
          VALUES ($1, $2)
        `,
    values: ["task", false],
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
