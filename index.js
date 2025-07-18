const express = require("express");
const app = express();
const port = 3000;
const supabase = require("./supabase");

const cors = require("cors");
const router = require("./router/router");

// app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// router
app.use(router);

app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const { data, error } = await supabase.auth.signInWithPassword({
    email: email,
    password: password
  });
  // console.log(data);
  // res.end('OK');
  if (error) {
    res.status(500).send(error);
  } else {
    res.json({    
      code: 200,
      message: '登录成功',
      data: data
    })
  }
})

app.listen(port, '192.168.8.5', () => {
  console.log(`Server is running on port ${port}`)
})