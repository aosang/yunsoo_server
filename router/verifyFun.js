const supabase = require("../supabase");

// 验证token的中间件
const verifyToken = async (req, res, next) => {
  const token = req.headers.authorization;
  try {
    // 检查token是否存在
    if (!token) {
      return res.status(401).json({
        code: 401,
        message: '缺少认证token',
        data: null
      });
    }

    // 移除Bearer前缀（如果存在）
    const tokenValue = token.startsWith('Bearer ') ? token.slice(7) : token;

    // 使用Supabase验证token
    const { data, error } = await supabase.auth.getUser(tokenValue);
    if (error) {
      return res.status(402).json({
        code: 402,
        message: 'token无效，请重新登录',
        data: error
      });
    }

    // 将用户信息添加到请求对象中，供后续路由使用
    
    req.user = data.user;
    next();
  } catch (error) {
    console.error('Token验证错误:', error);
    return res.status(500).json({
      code: 500,
      message: '服务器内部错误',
      data: error
    });
  }
}

module.exports = {
  verifyToken
}
