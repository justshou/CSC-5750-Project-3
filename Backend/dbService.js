// database services, accessbile by DbService methods.

const mysql = require("mysql");
const dotenv = require("dotenv");
dotenv.config(); // read from .env file

let instance = null;

console.log("HOST: " + process.env.DB_HOST);
console.log("DB USER: " + process.env.DB_USER);
console.log("DATABASE: " + process.env.DB_NAME);

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  ssl: {
    rejectUnauthorized: false,
  },
});

connection.connect((err) => {
  if (err) {
    console.log(err.message);
  }
  console.log("db " + connection.state); // to see if the DB is connected or not
});

class DbService {
  static getDbServiceInstance() {
    // only one instance is sufficient
    return instance ? instance : new DbService();
  }

  async getAllData() {
    try {
      // use await to call an asynchronous function
      const response = await new Promise((resolve, reject) => {
        const query = `
            SELECT 
            students.student_id,
            students.first_name,
            students.last_name,
            students.project_title,
            students.email,
            students.phone,
            slots.slot_label
            FROM students
            JOIN slots ON students.slot_number = slots.slot_number;
            `;
        connection.query(query, (err, results) => {
          if (err) reject(new Error(err.message));
          else resolve(results);
        });
      });

      // console.log("dbServices.js: search result:");
      // console.log(response);  // for debugging to see the result of select
      return response;
    } catch (error) {
      console.log(error);
    }
  }

  async getAvailableSlots() {
    try {
      const response = await new Promise((resolve, reject) => {
        const query = "SELECT * FROM slots WHERE capacity > 0;";

        connection.query(query, (err, results) => {
          if (err) reject(new Error(err.message));
          else resolve(results);
        });
      });

      return response;
    } catch (error) {
      console.log(error);
    }
  }

  async registerStudent(student) {
    const {
      student_id,
      first_name,
      last_name,
      project_title,
      email,
      phone,
      slot_number,
    } = student;

    try {
      const result = await new Promise((resolve, reject) => {
        const insertStudentQuery = `
        INSERT INTO students 
        (student_id, first_name, last_name, project_title, email, phone, slot_number)
        VALUES (?, ?, ?, ?, ?, ?, ?);
      `;

        connection.query(
          insertStudentQuery,
          [
            student_id,
            first_name,
            last_name,
            project_title,
            email,
            phone,
            slot_number,
          ],
          (err, result) => {
            if (err) {
              reject(new Error(err.message));
            } else {
              resolve(result);
            }
          },
        );
      });

      await new Promise((resolve, reject) => {
        const updateSlotQuery = `
        UPDATE slots 
        SET capacity = capacity - 1 
        WHERE slot_number = ? AND capacity > 0;
      `;

        connection.query(updateSlotQuery, [slot_number], (err, result) => {
          if (err) reject(new Error(err.message));
          else resolve(result);
        });
      });

      return { success: true };
    } catch (error) {
      console.log(error);
      return { success: false, message: error.message };
    }
  }
}

module.exports = DbService;
