import pkg from "pg";
import multer from "multer";
import { config as dotenvConfig } from "dotenv";
import { fileURLToPath } from "url";
import { dirname } from "path";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenvConfig({ path: path.resolve(__dirname, "../../.env") });
const { USER, HOST, DATABASE, PORT, PASSWORD } = process.env;
const { Pool } = pkg;

const insideDxFilePath = path.resolve(
  __dirname,
  "../../dist/uploads/insideDx/"
);
// "../../public/uploads/insideDx/"
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, insideDxFilePath);
  },
  filename: function async(req, file, cb) {
    const decode = decodeURIComponent(escape(file.originalname));
    cb(null, decode);
  },
});

const upload = multer({ storage: storage });

let pool = new Pool({
  user: USER,
  host: HOST,
  database: DATABASE,
  password: PASSWORD,
  port: PORT,
});

const throwQuery = async (res, query) => {
  await pool
    .query(query)
    .then((result) => {
      res.send(result.rows);
      // pool.end();
    })
    .catch((e) => {
      console.log(e.stack);
      res.status(500).send("An error occurred");
    });
};

const throwQueryNoRes = async (res, query) => {
  await pool.query(query).catch((e) => {
    console.log(e.stack);
    res.status(500).send("An error occurred");
  });
};

pool.connect();
console.log("psqlにアクセスしました");

export { pool, upload, insideDxFilePath, throwQuery, throwQueryNoRes };
