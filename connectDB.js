const mysql = require("mysql2");
const CryptoJS = require("crypto-js");

const connection = () => {
  const conn = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "111111",
    database: "manageruser",
    connectionLimit: 10,
  });
  return conn;
};

const createUser = () => {
  let listUser = [];
  let count = 0;
  const sql =
    "insert into user(username, password, loggedIn, loggedAt) values ?";
  // tạo vòng lặp thực hiện tạo 1 triệu data
  for (let i = 0; i < 1000000; i++) {
    let nameRandom = createRandomName(6);
    let passRandom = CryptoJS.SHA256(createRandomPass(6)).toString();
    let loggeId = 0;
    let loggedAt = null;
    if (i === 1) {
      nameRandom = "DuongN";
      passRandom = CryptoJS.SHA256("123456").toString();
      loggeId = 0;
      loggedAt = null;
    }
    const user = [nameRandom, passRandom, loggeId, loggedAt];
    listUser.push(user);

    // chia 1000 bản ghi để thực hiện insert lần lượt
    if ((i + 1) % 1000 === 0) {
      // thực hiện insert 1000 bản ghi 1 lần
      connection().query(sql, [listUser], (err, result) => {
        if (err) throw err;
        count += result.affectedRows;
        console.log("number of record insert:", count);
      });
      listUser = [];
    }
  }
};

connection().end;

// Hàm tạo chuỗi ngẫu nhiên từ a-z
const createRandomName = (length) => {
  let randomString = "";

  for (let i = 0; i < length; i++) {
    const randomCharCode = Math.floor(Math.random() * 26) + 97; // Tạo mã ASCII từ 97 ('a') đến 122 ('z')
    randomString += String.fromCharCode(randomCharCode);
  }

  return randomString;
};

// Hàm tạo chuỗi ngẫu nhiên từ 0-9
const createRandomPass = (length) => {
  let randomString = "";
  for (let i = 0; i < length; i++) {
    const randomDigit = Math.floor(Math.random() * 10); // Tạo một chữ số ngẫu nhiên từ 0 đến 9
    randomString += randomDigit.toString();
  }
  return randomString;
};

module.exports = { createUser, connection };
