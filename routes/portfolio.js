// 📁 routes/portfolio.js
const express = require('express');
const router = express.Router();
const db = require('../firebase');

// 取得所有作品
router.get('/', async (req, res) => {
  try {
    const snapshot = await db.collection('portfolio').orderBy('createdAt', 'desc').get();
    const data = [];
    snapshot.forEach(doc => {
      data.push({
        id: doc.id,
        ...doc.data()
      });
    });
    res.json({ success: true, data });
  } catch (error) {
    console.error('取得資料失敗:', error);
    res.status(500).json({ success: false, error: '取得資料失敗' });
  }
});

// 新增一筆作品
router.post('/', async (req, res) => {
  try {
    const { title, description, skill, thirdPartyServices, url , imgUrl } = req.body;

    if (!title || !description) {
      return res.status(400).json({ success: false, error: '缺少 title 或 description' });
    }

    const docRef = await db.collection('portfolio').add({
      title,
      description,
      skill: skill || [],
      thirdPartyServices: thirdPartyServices || [],
      url: url || '',
      imgUrl: imgUrl || '',
      createdAt: new Date()
    });

    res.status(201).json({ success: true, id: docRef.id });
  } catch (error) {
    console.error('新增失敗:', error);
    res.status(500).json({ success: false, error: '新增失敗' });
  }
});

module.exports = router;
