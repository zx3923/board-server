import express from "express";
import mysql from "mysql2/promise";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());

const pool = mysql.createPool({
    host: "localhost",
    user: "sbsst",
    password: "sbs123414",
    database: "a1",
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});


const port = 8000;

app.get("/", async (req, res) => {
    const [rows] = await pool.query("SELECT * FROM todo ORDER BY id DESC");

    res.json(rows);
});

app.listen(port);