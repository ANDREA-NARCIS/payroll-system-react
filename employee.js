export function getEmployeeDetails(id) {
  const employees = {
    101: { name: "Morgott", position: "Software Engineer", salary: 75000 },
    102: { name: "Godwyn", position: "UI Designer", salary: 65000 },
    103: { name: "Moghwyn", position: "Project Manager", salary: 90000 },
    104: { name: "Rennala", position: "Human Resource", salary: 50000 }, //I hate HRs
  };

  return employees[id] || null;
}
