// routes/users.js
const express = require('express');
const router = express.Router();
const db = require('../firebase'); // 你的 firebase 初始化檔案
const verifyToken = require('../middleware/authMiddleware.js'); // 權限驗證中介軟體
const bcrypt = require('bcrypt');

// 取得所有用戶（通常不公開，這裡示範用）
router.get('/', verifyToken, async (req, res) => {
  try {
    const snapshot = await db.collection('users').get();
    const users = [];
    snapshot.forEach(doc => {
      users.push({ id: doc.id, ...doc.data() });
    });
    res.json({ success: true, data: users });
  } catch (error) {
    console.error('取得使用者資料失敗:', error);
    res.status(500).json({ success: false, error: '取得使用者資料失敗' });
  }
});

// 以 username 查詢使用者資料（用於登入）
router.get('/:username', async (req, res) => {
  try {
    const { username } = req.params;
    const snapshot = await db.collection('users').where('username', '==', username).get();

    if (snapshot.empty) {
      return res.status(404).json({ success: false, error: '找不到使用者' });
    }

    // 取第一筆（假設 username 唯一）
    const userDoc = snapshot.docs[0];
    res.json({ success: true, data: { id: userDoc.id, ...userDoc.data() } });
  } catch (error) {
    console.error('查詢使用者失敗:', error);
    res.status(500).json({ success: false, error: '查詢使用者失敗' });
  }
});

// 新增使用者（需要權限驗證）
router.post('/', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ success: false, error: '請提供 username 和 password' });
    }

    // 檢查 username 是否已存在
    const snapshot = await db.collection('users').where('username', '==', username).get();
    if (!snapshot.empty) {
      return res.status(400).json({ success: false, error: '此 username 已被使用' });
    }

    // 密碼加密
    const hashedPassword = await bcrypt.hash(password, 10);

    // 新增使用者資料
    const docRef = await db.collection('users').add({
      username,
      password: hashedPassword,
      createdAt: new Date()
    });

    res.status(201).json({ success: true, id: docRef.id });
  } catch (error) {
    console.error('新增使用者失敗:', error);
    res.status(500).json({ success: false, error: '新增使用者失敗' });
  }
});

module.exports = router;
