import client from "./src/db/psqlClient.js";

client.connect();

const query = {
  text: "select * from insideDxLists",
};

client
  .query(query)
  .then((res) => {
    console.log(res.rows);
    client.end();
  })
  .catch((e) => {
    console.error(e.stack);
    client.end();
  });
