const express = require("express");
const app = express();
const port = 3000;
const cors = require("cors");
const supabase = require("./supabase");

// app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// 查询数据
app.get("/message", async (req, res) => {
  const { data, error } = await supabase.from("test_table").select("*");
  if (error) {
    res.status(500).send(error);
  } else {
    res.json(data);
  }
})

app.listen(port, '192.168.8.5', () => {
  console.log(`Server is running on port ${port}`)
})