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
  }else {
    res.json({
      code: 200,
      message: '删除成功',
      data: data
    })
  }
})

//获取设备类型
router.get('/DeviceType', verifyToken, async (req, res) => {
  const {data, error} = await supabase.from('product_type_cn')
  .select('*')

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

// 根据设备类型关联查询设备品牌
router.get('/DeviceBrand', verifyToken, async (req, res) => {
  const { deviceTypeText } = req.query
  
  const {data, error} = await supabase.from('product_type_cn')
  .select(`key, product_brand_cn(value, brand_id, logo_url)`)
  .eq('key', deviceTypeText)

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

// 新增设备
router.post('/AddDevice', verifyToken, async (req, res) => {
  const { device_name, device_type, device_brand, device_price, device_number, device_total, device_remark, device_time, device_update, device_user, device_logo } = req.body
  
  const {data, error} = await supabase.from('it_assets_cn')
  .insert({
    product_name: device_name,
    product_type: device_type,
    product_brand: device_brand,
    product_unitprice: parseFloat(device_price),
    product_number: device_number,
    product_price: parseFloat(device_total),
    product_remark: device_remark,
    product_time: device_time,
    product_user: device_user,
    product_logo: device_logo,
    product_update: device_update,
    value: device_name
  })

  if (error) {
    res.json({
      code: 400,
      message: '新增失败',
      data: error
    })
  }else {
    res.json({
      code: 200,
      message: '新增成功',
      data: data
    })
  }
})

// 获取详情
router.post('/GetDeviceDetail', verifyToken, async (req, res) => {
  const { deviceId } = req.body

  const {data, error} = await supabase.from('it_assets_cn')
  .select('*')
  .eq('id', deviceId)

  if (error) {
    res.json({
      code: 400,
      message: '获取数据失败',
      data: error
    })
  }
  else {
    res.json({
      code: 200,
      message: '获取数据成功',
      data: data
    })
  }
})

module.exports = router