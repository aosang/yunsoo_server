const express = require("express");
const app = express();
const port = 3000;
const cors = require("cors");
const router = require("./router/router");

// app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// 查询数据
app.use(router);

app.listen(port, '192.168.120.233', () => {
  console.log(`Server is running on port ${port}`)
})