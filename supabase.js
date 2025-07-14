const { createClient } = require('@supabase/supabase-js')

// 替换为你自己的 Supabase 项目配置
const supabaseUrl = 'https://ctfrp48g91ht4obgh0u0.baseapi.memfiredb.com'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImV4cCI6MzMxMTEyNzQ0MSwiaWF0IjoxNzM0MzI3NDQxLCJpc3MiOiJzdXBhYmFzZSJ9.WACMGD6elHIwdTVXl8damAk9mz2uhjfs170FHOO0KcI'

const supabase = createClient(supabaseUrl, supabaseKey)

module.exports = supabase