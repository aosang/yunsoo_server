const express = require("express");
const supabase = require("../supabase");
const router = express.Router()

// 登录
router.post('/Login', async (req, res) => {
  const { email, password } = req.body;
  const { data, error } = await supabase.auth.signInWithPassword({
    email: email,
    password: password
  })

  if (error) {
    res.json({
      code: 400,
      message: '登录失败',
      data: error
    })
  } else {
    res.json({    
      code: 200,
      message: '登录成功',
      data: data
    })
  }
})

// 获取session
router.get('/GetSession', async (req, res) => {
  const { data, error } = await supabase.auth.getSession();
  if (error) {
    res.json({
      code: 400,
      message: '获取session失败',
      data: error
    })
  } else {
    res.json({
      code: 200,
      message: '获取session成功',
      data: data
    })
  }
})

// 退出登录
router.post('/Logout', async (req, res) => {
  const { data, error } = await supabase.auth.signOut();
  if (error) {
    res.json({
      code: 400,
      message: '退出失败',
      data: error
    })
  } else {
    res.json({
      code: 200,
      message: '退出登录',
      data: data
    })
  }
})

module.exports = router