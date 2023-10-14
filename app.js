const express = require("express");
const cors = require("cors");
const CryptoJS = require("crypto-js");
const bodyParser = require("body-parser");
const { createUser, connection } = require("./connectDB");

const app = express();

app.use(cors());
app.use(bodyParser.json());

// API login
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  if ((!username, !password)) {
    return res.send({
      mess: "chưa nhập username, password",
    });
  }
  const sql = "Select * from user where username = ? and password = ?";
  connection().query(
    sql,
    [username, CryptoJS.SHA256(password).toString()],
    (err, result) => {
      if (err) {
        res.send({
          mess: "error database",
        });
        return;
      }
      if (result.length > 0) {
        res.send({
          result: "success",
          userId: result[0].userId,
        });
        updateLog(result[0].loggedIn, result[0].userId);
        return;
      } else {
        res.send({
          result: "failed",
        });
        return;
      }
    }
  );
});

const updateLog = (loggedIn, userId) => {
  const loggedAt = new Date();
  const sql = "update user set loggedIn = ?, loggedAt = ? where userId = ?";

  connection().query(
    sql,
    [parseInt(loggedIn) + 1, loggedAt, userId],
    (err, result) => {
      if (err) {
        console.log("update failed");
        return;
      }
    }
  );
};

// API find password
app.post("/findPassword", (req, res) => {
  const sql = "Select * from user where username = ?";
  connection().query(sql, [req.body.username], (err, result) => {
    if (err) {
      res.send({
        mess: false,
      });
      return;
    }
    if (result.length > 0) {
      res.send({
        mess: true,
        password: result[0].password,
      });
    } else {
      res.send({
        mess: false,
      });
    }
  });
});

const port = 3800;
app.listen(port, () => {
  // createUser();
  console.log(`Server is running on http://localhost:${port}`);
});
