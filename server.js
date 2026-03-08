import cors from "cors";
import express from "express";

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

let payrollData = {
  name: "Andrea Narcis",
  position: "Software Engineer",
  salary: 50000,
  netSalary: 41000
};

app.post("/api/payroll", (req, res) => {
  payrollData = req.body;
  res.json({ status: "ok" });
});

app.get("/api/payroll", (req, res) => {
  res.json(payrollData);
});

app.listen(PORT, () => {
  console.log(`API running at http://localhost:${PORT}`);
});