const express = require("express");
const router = express.Router();

/* GET home page. */
router.get("/", (req, res, next) => {
  //var db = req.con; 使用解構賦值
  const { con } = req;

  let data = "";

  //var user = req.query.user;
  const { user } = req.query;

  let filter = "";
  if (user) {
    filter = "WHERE userid = ?";
  }

  //account後面要有空白
  con.query(`SELECT * FROM account ${filter}`, user, (err, rows) => {
    if (err) {
      console.log(err);
    }
    data = rows;
    // use index.ejs
    //物件實字
    // res.render("index", {
    //   title: "Account Information",
    //   data: data,
    //   user: user,
    // });
    res.render("index", { title: "Account Information", data, user });
  });
});

// add page
router.get("/add", (req, res, next) => {
  // use userAdd.ejs
  res.render("userAdd", { title: "Add User" });
});

// add post
router.post("/userAdd", (req, res, next) => {
  console.log("有進來嗎?");
  const { con } = req;

  const { userid, password, email } = req.body;
  let sql = {
    userid: userid,
    password: password,
    email: email,
  };

  //console.log(sql);
  con.query("INSERT INTO account SET ?", sql, (err, rows) => {
    if (err) {
      console.log(err);
    }
    res.setHeader("Content-Type", "application/json");
    res.redirect("/");
  });
});

// edit page
router.get("/userEdit", (req, res, next) => {
  const { id } = req.query;
  const { con } = req;
  let data = "";

  con.query("SELECT * FROM account WHERE id = ?", id, (err, rows) => {
    if (err) {
      console.log(err);
    }

    let data = rows;
    res.render("userEdit", { title: "Edit account", data });
  });
});

//編輯
router.post("/userEdit", (req, res, next) => {
  const { con } = req;
  const { id } = req.body;

  const { userid, password, email } = req.body;
  let sql = {
    userid: userid,
    password: password,
    email: email,
  };

  con.query("UPDATE account SET ? WHERE id = ?", [sql, id], (err, rows) => {
    if (err) {
      console.log(err);
    }

    res.setHeader("Content-Type", "application/json");
    res.redirect("/");
  });
});

//刪除
router.get("/userDelete", (req, res, next) => {
  const { id } = req.query;
  const { con } = req;

  con.query("DELETE FROM account WHERE id = ?", id, (err, rows) => {
    if (err) {
      console.log(err);
    }
    res.redirect("/");
  });
});

module.exports = router;
