import express from "express";
import cors from "cors";
import dxRoute from "./api-routes/dx.js";
import departmentsRoute from "./api-routes/departments.js";
const app = express();

// "http://172.16.16.134:5173"
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: "http://localhost:5173",
    optionsSuccessStatus: 200,
  })
);
app.use("/dx", dxRoute);
app.use("/departments", departmentsRoute);

app.listen(8000, "localhost", function () {
  console.log("listen ....");
});
