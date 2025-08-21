const express = require("express");
const supabase = require("../supabase");
const router = express.Router()
const { verifyToken } = require("./verifyFun")

router.get("/Library", verifyToken, async (req, res) => {
  const { userId } = req.query

  const { data, error } = await supabase.from('library_table_cn')
    .select('*')

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
router.post('/uploadLibraryImage',  async (req, res) => {
  console.log(req);
  
  // const { data, error } = await supabase.storage
  //   .from('knowledge_image')
  //   .upload(imageFilePath, fileType)

  // if (error) {
  //   res.json({
  //     code: 400,
  //     message: '上传失败',
  //     data: error
  //   })
  // } else {
  //   res.json({
  //     code: 200,
  //     message: '上传成功',
  //     data: data
  //   })
  // }
})

module.exports = router