const express = require("express");
const supabase = require("../supabase");
const router = express.Router()
const { verifyToken } = require("./verifyFun")

router.get('/Device', verifyToken, async (req, res) => {
  const {data, error} = await supabase.from('it_assets_cn')
  .select('*')
  .order('product_time', { ascending: false })

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

// 删除设备
router.post('/DeleteDevice', verifyToken, async (req, res) => { 
  const { deviceId } = req.body

  const {data, error} = await supabase.from('it_assets_cn')
  .delete()
  .eq('id', deviceId)

  if (error) {
    res.json({
      code: 400,
      message: '删除失败',
      data: error
    })
  }
  else {
    res.json({
      code: 200,
      message: '删除成功',
      data: data
    })
  }
})

module.exports = router