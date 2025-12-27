// Sample assignments with pre-loaded data
export const assignments = [
  {
    id: 1,
    title: "Basic SELECT Queries",
    difficulty: "Easy",
    description: "Learn the fundamentals of SELECT statements",
    question: "Write a SQL query to retrieve all columns from the 'employees' table where the salary is greater than 50000.",
    tables: {
      employees: {
        schema: "id (INT), name (VARCHAR), department (VARCHAR), salary (INT)",
        sampleData: [
          { id: 1, name: "John Doe", department: "Engineering", salary: 75000 },
          { id: 2, name: "Jane Smith", department: "Marketing", salary: 60000 },
          { id: 3, name: "Bob Johnson", department: "Engineering", salary: 45000 },
          { id: 4, name: "Alice Williams", department: "HR", salary: 55000 },
          { id: 5, name: "Charlie Brown", department: "Engineering", salary: 80000 }
        ]
      }
    },
    expectedColumns: ["id", "name", "department", "salary"]
  },
  {
    id: 2,
    title: "JOIN Operations",
    difficulty: "Medium",
    description: "Practice joining multiple tables",
    question: "Write a SQL query to retrieve employee names and their department names by joining the 'employees' and 'departments' tables.",
    tables: {
      employees: {
        schema: "id (INT), name (VARCHAR), department_id (INT), salary (INT)",
        sampleData: [
          { id: 1, name: "John Doe", department_id: 1, salary: 75000 },
          { id: 2, name: "Jane Smith", department_id: 2, salary: 60000 },
          { id: 3, name: "Bob Johnson", department_id: 1, salary: 45000 },
          { id: 4, name: "Alice Williams", department_id: 3, salary: 55000 }
        ]
      },
      departments: {
        schema: "id (INT), name (VARCHAR), location (VARCHAR)",
        sampleData: [
          { id: 1, name: "Engineering", location: "Building A" },
          { id: 2, name: "Marketing", location: "Building B" },
          { id: 3, name: "HR", location: "Building C" }
        ]
      }
    },
    expectedColumns: ["name", "department_name"]
  },
  {
    id: 3,
    title: "Aggregate Functions",
    difficulty: "Medium",
    description: "Use COUNT, SUM, AVG, and GROUP BY",
    question: "Write a SQL query to find the average salary for each department from the 'employees' table.",
    tables: {
      employees: {
        schema: "id (INT), name (VARCHAR), department (VARCHAR), salary (INT)",
        sampleData: [
          { id: 1, name: "John Doe", department: "Engineering", salary: 75000 },
          { id: 2, name: "Jane Smith", department: "Marketing", salary: 60000 },
          { id: 3, name: "Bob Johnson", department: "Engineering", salary: 45000 },
          { id: 4, name: "Alice Williams", department: "HR", salary: 55000 },
          { id: 5, name: "Charlie Brown", department: "Engineering", salary: 80000 },
          { id: 6, name: "Diana Prince", department: "Marketing", salary: 65000 }
        ]
      }
    },
    expectedColumns: ["department", "avg_salary"]
  }
]

