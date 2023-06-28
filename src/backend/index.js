import express from "express";
import cors from "cors";
import insideDxRoute from "./api-routes/insideDx.js";
import departmentsRoute from "./api-routes/departments.js";
const app = express();

// "http://172.16.16.134:5173"
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: "http://172.16.16.134:5173",
    optionsSuccessStatus: 200,
  })
);
app.use("/insideDx", insideDxRoute);
app.use("/departments", departmentsRoute);

app.listen(8000, "172.16.16.134", function () {
  console.log("listen ....");
});
