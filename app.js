import express from "express";
import mysql from "mysql2/promise";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());

const port = 8000;

const pool = mysql.createPool({
  host: "localhost",
  user: "sbsst",
  password: "sbs123414",
  database: "a1",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

app.get("/list", async (req, res) => {
  const [rows] = await pool.query("SELECT * FROM BOARD");
  res.json(rows);
});

// // 단건조회
app.get("/list/:id", async (req, res) => {
  const { id } = req.params;
  const [rows] = await pool.query(
    `
    SELECT *
    FROM BOARD
    WHERE id = ?
    `,
    [id]
  );
  if (rows.length == 0) {
    res.status(404).json({
      msg: "not found",
    });
    return;
  }
  res.json(rows[0]);
});
// 단건조회
// 추가
app.post("/list", async (req, res) => {
  const {
    body: { board_content },
  } = req;
  await pool.query(
    `
    INSERT INTO BOARD
    SET register_date = NOW(),
        board_content = ?
    `,
    [board_content]
  );
  const [updatedTitles] = await pool.query(
    `
    SELECT *
    FROM BOARD
    ORDER BY id DESC
    `
  );
  res.json(updatedTitles);
});

// 추가
// 수정
app.patch("/list/:id", async (req, res) => {
  const { id } = req.params;
  const { board_title, board_content } = req.body;

  const [rows] = await pool.query(
    `
    SELECT *
    FROM BOARD
    WHERE id= ?
    `,
    [id]
  );

  if (rows.length === 0) {
    res.status(404).json({
      msg: "not found",
    });
  }

  if (!board_title) {
    res.status(400).json({
      msg: "제목이 비었습니다.",
    });
    return;
  }

  if (!board_content) {
    res.status(400).json({
      msg: "내용이 비었습니다.",
    });
    return;
  }

  const [rs] = await pool.query(
    `
UPDATE BOARD
SET board_title = ?,
board_content = ?
WHERE id = ?
`,
    [board_title, board_content, id]
  );
  res.json({
    msg: `${id}번 할 일이 수정되었습니다.`,
  });
});
//수정
// 삭제
app.delete("/list/:id", async (req, res) => {
  const { id } = req.params;
  const [[row]] = await pool.query(
    `
    SELECT *
    FROM BOARD
    WHERE id = ?`,
    [id]
  );
  if (row === undefined) {
    res.status(404).json({
      msg: "not found",
    });
    return;
  }
  const [rs] = await pool.query(
    `
    DELETE FROM BOARD
    WHERE id = ?`,
    [id]
  );
  res.json({
    msg: `${id}번 할 일이 삭제되었습니다.`,
  });
});

app.listen(port);
