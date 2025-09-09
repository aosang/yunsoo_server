const express = require("express");
const supabase = require("../supabase");
const router = express.Router()
const { verifyToken } = require("./verifyFun")
const multer = require("multer")
const dayjs = require("dayjs")

router.get("/Library", verifyToken, async (req, res) => {
  const { userId } = req.query

  const { data, error } = await supabase.from('library_table_cn')
    .select('*')
    .order('created_time', { ascending: false })

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

// 获取详情
router.get('/LibraryDetail', verifyToken, async (req, res) => {
  const { libraryId } = req.query

  const { data, error } = await supabase.from('library_table_cn')
    .select('*')
    .eq('created_id', libraryId)

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

// 删除知识库
router.post('/DeleteLibrary', verifyToken, async (req, res) => {
  const { libraryId } = req.body

  const { data, error } = await supabase.from('library_table_cn')
  .delete()
  .eq('created_id', libraryId)

  if (error) {
    res.json({
      code: 400,
      message: '删除失败',
      data: error
    })
  } else {
    res.json({
      code: 200,
      message: '删除成功',
      data: data
    })
  }
})

// 新增知识库上传图片
const storage = multer.memoryStorage()
const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/jpg'];
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true)
  } else {
    cb(new Error('仅允许上传图片文件！'), false)
  }
}

const upload = multer({
  storage: storage,
  fileFilter: fileFilter, // 使用文件类型验证
  limits: {
    fileSize: 10 * 1024 * 1024 // 限制文件大小为 10MB
  }
})


router.post('/uploadLibraryImage', verifyToken, upload.single('file'),  async (req, res) => {
  const { file } = req
  // let fileParse = JSON.parse(file)
  if (!file) {
    return res.status(400).json({
      code: 400,
      message: '未找到上传的文件'
    })
  }

  try {
    const imageFilePath = `${file.originalname}`
    const fileType = file.mimetype

    const { data, error } = await supabase.storage
    .from('knowledge_image')
    .upload(imageFilePath, file.buffer, {
      cacheControl: '3600',
      upsert: true,
      contentType: fileType
    })
    
    if (error) {
      res.json({
        code: 400,
        message: '上传失败',
        data: error.message || error
      })
    }else {
      // 获取图片的URL
      const { data: { publicUrl } } = supabase.storage
      .from('knowledge_image')
      .getPublicUrl(imageFilePath)

      res.json({
        code: 200,
        message: '上传成功',
        data: {
          url: publicUrl
        }
      })
    }      
  } catch (error) {
    res.json({
      code: 500,
      message: '上传失败',
      data: error.message || error
    })
  }
})

// 获取类型,并按product_id排序
router.get('/getLibraryType', verifyToken, async (req, res) => {
  const { data, error } = await supabase.from('product_type_cn')
    .select('*')
    .order('product_id', { ascending: true })

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

// 新增知识库
router.post('/addLibrary', verifyToken, async (req, res) => {
  const {libraryId,libraryTitle, libraryText, libraryTypeValue, libraryTime, libraryAuthor, libraryHtml } = req.body

  const { data, error } = await supabase.from('library_table_cn')
  .insert({
    id: libraryId,
    created_time: libraryTime,
    author: libraryAuthor,
    title: libraryTitle,
    description: libraryText,
    type: libraryTypeValue,
    content: libraryHtml,
  })
  if (error) {
    res.json({
      code: 400,
      message: '新增失败',
      data: error
    })
  } else {
    res.json({
      code: 200,
      message: '新增成功',
      data: data
    })
  }
})

// 知识库查询，按发布者查询，按时间查询，按类型查询，按关键字查询，多条件查询
router.post('/searchLibrary', verifyToken, async (req, res) => {
  const { searchAuthor, searchTime, searchType, searchKeyword } = req.body

  let todayStart = ""
  let firstDayOfWeek = ""
  let currentMonthStart = ""
  let currentYearStart = ""
  // 发布者，时间，类型，关键字都包含，进行多条件查询
  switch (searchTime) {
    case '1':
      todayStart = new Date().setHours(0, 0, 0, 0)
      todayStart = dayjs(todayStart).format('YYYY-MM-DD HH:mm:ss')
      break
    case '2':
      const currentDate = new Date();
      firstDayOfWeek = new Date(currentDate.setDate(currentDate.getDate() - currentDate.getDay() + 1))
      firstDayOfWeek.setHours(0, 0, 0, 0)
      firstDayOfWeek = dayjs(firstDayOfWeek).format('YYYY-MM-DD HH:mm:ss')
      break
    case '3':
      currentMonthStart = new Date()
      currentMonthStart.setDate(1)
      currentMonthStart.setHours(0, 0, 0, 0)
      currentMonthStart = dayjs(currentMonthStart).format('YYYY-MM-DD HH:mm:ss')
      break
    case '4':
      currentYearStart = new Date()
      currentYearStart.setMonth(0)
      currentYearStart.setDate(1)
      currentYearStart.setHours(0, 0, 0, 0)
      currentYearStart = dayjs(currentYearStart).format('YYYY-MM-DD HH:mm:ss')
      break
  }
  
  let query = supabase.from('library_table_cn')
    .select('*')
    .ilike('author', `%${searchAuthor}%`)

  // searchTime如果为1按今天查询，2按本周查询，3 按本月查询，4 按本年查询
  if (searchTime === '1') {
    query = query.gte('created_time', todayStart).lte('created_time', dayjs(new Date()).format('YYYY-MM-DD HH:mm:ss'))
  } else if (searchTime === '2') {
    query = query.gte('created_time', firstDayOfWeek).lte('created_time', dayjs(new Date()).format('YYYY-MM-DD HH:mm:ss'))
  } else if (searchTime === '3') {
    query = query.gte('created_time', currentMonthStart).lte('created_time', dayjs(new Date()).format('YYYY-MM-DD HH:mm:ss'))
  } else if (searchTime === '4') {
    query = query.gte('created_time', currentYearStart).lte('created_time', dayjs(new Date()).format('YYYY-MM-DD HH:mm:ss'))
  }

  // 分别处理每个搜索条件
  if (searchType && searchType !== '') {
    query = query.ilike('type', `%${searchType}%`)
  }
  
  if (searchKeyword && searchKeyword !== '') {
    query = query.or(`title.ilike.%${searchKeyword}%,description.ilike.%${searchKeyword}%`)
  }
  
  query = query.order('created_time', { ascending: false })
  
  
  // 如果都为空，则查询所有
  if (searchAuthor === '' && searchTime === '' && searchType === '' && searchKeyword === '') {
    query = query.order('created_time', { ascending: false })
  }

  const { data, error } = await query
    if (error) {
      res.json({  
      code: 400,
      message: '查询失败',
      data: error
    })
  } else {
    res.json({
      code: 200,
      message: '查询成功',
      data: data
    })
  }
})


module.exports = router