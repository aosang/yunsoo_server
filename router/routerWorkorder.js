const express = require("express")
const router = express.Router()
const supabase = require("../supabase")
const { verifyToken } = require("./verifyFun")

// 获取工单数据
router.get('/GetWorkorder', verifyToken, async (req,  res) => {
  const { userId } = req.query
  // 按时间排序,按userid筛选
  const { data, error } = await supabase.from('work_order_cn')
    .select('*')
    .order('created_time', { ascending: false })
    .eq('id', userId)

  if (error) {
    res.json({
      code: 400,
      message: '获取数据失败',
      data: error
    })
  } else {
    res.json({
      code: 200,
      message: '获取数据成功',
      data: data
    })
  }
})

module.exports = router