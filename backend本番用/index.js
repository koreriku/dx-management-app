import express from "express";
import cors from "cors";
import dxRoute from "./api-routes/dx.js";
import departmentsRoute from "./api-routes/departments.js";
import dxWg from "./api-routes/dxWg.js";
import dxWgCategory from "./api-routes/dxWgCategory.js";
const app = express();

// "http://172.16.16.134:5173"
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:5174"],
    optionsSuccessStatus: 200,
  })
);
app.use("/dx", dxRoute);
app.use("/departments", departmentsRoute);
app.use("/dxWg", dxWg);
app.use("/dxWgCategory", dxWgCategory);

app.listen(8000, "localhost", function () {
  console.log("listen ....");
});
