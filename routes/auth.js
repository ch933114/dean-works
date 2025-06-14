// routes/auth.js
const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();

// 假帳號資料（可改成從 Firebase 取）
const users = [
  { id: 1, username: 'admin', password: '1234' }
];

const SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';

// 登入 API
router.post('/login', (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username && u.password === password);

  if (!user) {
    return res.status(401).json({ success: false, message: '帳號或密碼錯誤' });
  }

  const token = jwt.sign({ id: user.id, username: user.username }, SECRET, { expiresIn: '1h' });
  res.json({ success: true, token });
});

module.exports = router;
