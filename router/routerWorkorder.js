const express = require("express")
const router = express.Router()
const supabase = require("../supabase")
const { verifyToken } = require("./verifyFun")

// 获取工单数据
router.get('/GetWorkorder', verifyToken, async (req,  res) => {
  const { userId, tabId } = req.query

  // 构建查询
  let query = supabase.from('work_order_cn')
    .select('*')
    .order('created_time', { ascending: false })
    .eq('id', userId)
  
  // 根据tabId筛选数据
  // tabId为0时筛选所有数据
  // tabId为1时，筛选created_status为已完成
  // tabId为2时，筛选处理中
  // tabId为3时，筛选待处理
  if (tabId && tabId !== '0') {
    let statusValue
    switch (tabId) {
      case '1':
        statusValue = '已解决'
        break
      case '2':
        statusValue = '处理中'
        break
      case '3':
        statusValue = '待处理'
        break
      default:
        statusValue = null
    }
    
    if (statusValue) {
      query = query.eq('created_status', statusValue)
    }
  }
  
  const { data, error } = await query
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

// 获取设备
router.get('/GetDevice', verifyToken, async (req, res) => {
  const { data, error } = await supabase.from('it_assets_cn').select('*')
  if (error) {
    res.json({
      code: 400,
      message: '获取数据失败',
      data: error
    })
  }else {
    res.json({
      code: 200,
      message: '获取数据成功',
      data: data
    })
  }
})

// 获取状态
router.get('/GetStatus', verifyToken, async (req, res) => {
  const { data, error } = await supabase.from('product_status_cn').select('*')
  if (error) {
    res.json({
      code: 400,
      message: '获取数据失败',
      data: error
    })
  }else {
    res.json({
      code: 200,
      message: '获取数据成功',
      data: data
    })
  }
})

// 新增工单
router.post('/AddWorkorder', verifyToken, async (req, res) => {
  const {
    id, 
    created_id, 
    created_name, 
    created_product, 
    created_status, 
    created_time, 
    created_update, 
    created_remark, 
    created_type, 
    created_brand, 
    created_solved, 
    created_text 
  } = req.body
    const { data, error } = await supabase.from('work_order_cn').insert({
      id,
      created_id,
      created_name,    
      created_product,
      created_status,
      created_time,
      created_update,
      created_remark,
      created_type,
      created_brand,
      created_solved,
      created_text
    })
    if (error) {
      res.json({
        code: 400,
        message: '新增数据失败',
        data: error
      })
    }else {
      res.json({
        code: 200,
        message: '新增数据成功',
        data: data
      })
    }
})

// 删除工单
router.post('/DeleteWorkorder', verifyToken, async (req, res) => {
  const { delId } = req.body
  
  const { data, error } = await supabase
    .from('work_order_cn')
    .delete()
    .eq('created_id', delId)

  if (error) {
    res.json({
      code: 400,
      message: '删除数据失败',
      data: error
    })
  }else {
    res.json({
      code: 200,
      message: '删除数据成功',
      data: data
    })
  }
})

// 获取工单详情
router.get('/GetWorkorderDetail', verifyToken, async (req, res) => {
  const { workDetailId } = req.query
  const { data, error } = await supabase.from('work_order_cn')
    .select('*')
    .eq('created_id', workDetailId)
  if (error) {
    res.json({
      code: 400,
      message: '获取数据失败',
      data: error 
    })
  }else {
    res.json({
      code: 200,
      message: '获取数据成功',
      data: data  
    })
  }
})

// 更新数据
router.post('/UpdateWorkorder', verifyToken, async (req, res) => { 
  const {created_id, created_status, created_update, created_solved, created_text, created_remark} = req.body
  
  const { data, error } = await supabase.from('work_order_cn')
    .update({
      created_status,
      created_update,
      created_solved,
      created_text,
      created_remark
    })
    .eq('created_id', created_id)
  if (error) {
    res.json({
      code: 400,
      message: '更新数据失败',
      data: error
    })
  }else {
    res.json({
      code: 200,
      message: '更新数据成功',
      data: data
    })
  }
})

// 测试数据
router.get('/Test', (req, res) => {
  res.json({
    code: 200,
    message: '测试数据',
    data: {
      id: 1,
      name: '测试数据'
    }
  })
})

module.exports = router