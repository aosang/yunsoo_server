const express = require("express");
const supabase = require("../supabase");
const router = express.Router()
const { verifyToken } = require("./verifyFun")

router.get('/Profile', verifyToken, async (req, res) => {
  const { user_id } = req.query
  const { data, error } = await supabase.from('profiles')
  .select('*')
  .eq('id', user_id)

  if (error) {
    res.json({
      code: 400,
      message: '获取用户信息失败',
      data: error
    })
  } else {
    res.json({
      code: 200,
      message: '获取用户信息成功',
      data: data
    })
  }
})

module.exports = router