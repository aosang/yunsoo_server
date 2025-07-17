const express = require("express");
const supabase = require("../supabase");
const router = express.Router()

router.get('/message', async (req, res) => {
  const { data, error } = await supabase.from("test_table").select("*");
  if (error) {
    res.status(500).send(error);
  } else {
    res.json({
      code: 200,
      message: "sucess",
      data: data
    });
  }
})

module.exports = router