import express from "express";
import pkg from "pg";
import { config as dotenvConfig } from "dotenv";
import { fileURLToPath } from "url";
import { dirname } from "path";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenvConfig({ path: path.resolve(__dirname, "./.env") });
const { PASSWORD } = process.env;
const { Client } = pkg;

let client = new Client({
  user: "postgres",
  host: "localhost",
  database: "dx",
  password: PASSWORD,
  port: 5432,
});

// client.connect();

export default client;
