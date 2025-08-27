const express = require("express");
const supabase = require("../supabase");
const router = express.Router()
const { verifyToken } = require("./verifyFun")
const multer = require("multer")

router.get("/Library", verifyToken, async (req, res) => {
  const { userId } = req.query

  const { data, error } = await supabase.from('library_table_cn')
    .select('*')

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
router.post('/deleteLibrary', verifyToken, async (req, res) => {
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

// 获取类型
router.get('/getLibraryType', verifyToken, async (req, res) => {
  const { data, error } = await supabase.from('product_type_cn')
    .select('*')

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

module.exports = router