// routes/auth.js
const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const router = express.Router();
const db = require('../firebase');


const SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';

// 登入 API
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ success: false, message: '請輸入 username 和 password' });
  }

  try {
    // 從 Firestore 找 username
    const snapshot = await db.collection('users').where('username', '==', username).get();

    if (snapshot.empty) {
      return res.status(401).json({ success: false, message: '帳號或密碼錯誤' });
    }

    const userDoc = snapshot.docs[0];
    const userData = userDoc.data();

    // 用 bcrypt 比對密碼
    const isMatch = await bcrypt.compare(password, userData.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: '帳號或密碼錯誤' });
    }

    // 密碼正確，簽發 JWT
    const token = jwt.sign(
      { id: userDoc.id, username: userData.username },
      SECRET,
      { expiresIn: '1h' }
    );

    res.json({ success: true, token });
  } catch (error) {
    console.error('登入失敗:', error);
    res.status(500).json({ success: false, message: '伺服器錯誤' });
  }
});

module.exports = router;
