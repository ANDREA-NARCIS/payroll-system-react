import Table from "cli-table3";
import calculateTax from "./tax.js";
import chalk from "chalk";
import figlet from "figlet";
import { getEmployeeDetails } from "./employee.js";
import gradient from "gradient-string";
import inquirer from "inquirer";
import open from "open";
import ora from "ora";
import { spawn } from "child_process";

// Banner
console.log(
  gradient.pastel(
    figlet.textSync("Payroll CLI", {
      horizontalLayout: "default"
    })
  )
);


// Prompt
const answers = await inquirer.prompt([
  {
    type: "input",
    name: "id",
    message: chalk.yellow("Enter Employee ID:")
  },
  {
    type: "confirm",
    name: "browser",
    message: chalk.cyan("Do you want results in a browser?"),
    default: true
  }
]);


// Spinner
const spinner = ora("Fetching employee details...").start();

await new Promise(r => setTimeout(r, 1200));

const employee = getEmployeeDetails(answers.id);

if (!employee) {
  spinner.fail(chalk.red("Employee not found"));
  process.exit();
}

spinner.succeed("Employee data loaded");


// Payroll calculation
const tax = calculateTax(employee.salary);
const netSalary = employee.salary - tax;


// Store data for API
global.payrollData = {
  id: answers.id,
  name: employee.name,
  position: employee.position,
  salary: employee.salary,
  tax,
  netSalary
};


// Browser Mode
if (answers.browser) {

  const launchSpinner = ora("Starting server and React app...").start();

  // Start Express API
  spawn("node", ["server.js"], {
    stdio: "inherit"
  });

  // Wait for Express to be ready, then POST payroll data
  const sendData = async (retries = 5) => {
    for (let i = 0; i < retries; i++) {
      try {
        await new Promise(r => setTimeout(r, 1000));
        const res = await fetch("http://localhost:3000/api/payroll", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(global.payrollData)
        });
        if (res.ok) return true;
      } catch {
        // Server not ready yet, retry
      }
    }
    return false;
  };

  const sent = await sendData();
  if (!sent) {
    launchSpinner.fail(chalk.red("Failed to send payroll data to server"));
    process.exit(1);
  }

  // Start React
  spawn("npm", ["run", "dev"], {
    cwd: "./client",
    stdio: "inherit",
    shell: true
  });

  await new Promise(r => setTimeout(r, 3000));

  launchSpinner.succeed("Application started");

  console.log(chalk.green("\nOpening payroll dashboard in browser...\n"));

  await open("http://localhost:5173");

}


// CLI Mode
else {

  const table = new Table({
    head: [
      chalk.blue.bold("Field"),
      chalk.blue.bold("Value")
    ],
    colWidths: [20, 35],
    style: { border: ["cyan"] }
  });

  table.push(
    ["Employee ID", chalk.green(answers.id)],
    ["Name", chalk.yellow(employee.name)],
    ["Position", chalk.magenta(employee.position)],
    ["Salary", chalk.green(`₹${employee.salary}`)],
    ["Tax (18%)", chalk.red(`₹${tax.toFixed(2)}`)],
    ["Net Salary", chalk.green.bold(`₹${netSalary.toFixed(2)}`)]
  );

  console.log("\n" + table.toString());

}