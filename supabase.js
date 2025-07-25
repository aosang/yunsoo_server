const { createClient } = require('@supabase/supabase-js')
require('dotenv').config()

// 从环境变量获取 Supabase 配置
const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_ANON_KEY

const supabase = createClient(supabaseUrl, supabaseKey)

module.exports = supabase