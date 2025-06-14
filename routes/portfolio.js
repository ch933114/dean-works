// routes/portfolio.js
const express = require('express');
const router = express.Router();
const db = require('../firebase');
const verifyToken = require('../middleware/authMiddleware.js');

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
router.post('/',verifyToken, async (req, res) => {
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

// 編輯一筆作品
router.put('/:id',verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, skill, thirdPartyServices, url, imgUrl } = req.body;

    const docRef = db.collection('portfolio').doc(id);
    const doc = await docRef.get();

    if (!doc.exists) {
      return res.status(404).json({ success: false, error: '找不到該作品' });
    }

    await docRef.update({
      title,
      description,
      skill: skill || [],
      thirdPartyServices: thirdPartyServices || [],
      url: url || '',
      imgUrl: imgUrl || '',
      updatedAt: new Date()
    });

    res.json({ success: true, message: '更新成功' });
  } catch (error) {
    console.error('更新失敗:', error);
    res.status(500).json({ success: false, error: '更新失敗' });
  }
});

// 刪除一筆作品
router.delete('/:id',verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const docRef = db.collection('portfolio').doc(id);
    const doc = await docRef.get();

    if (!doc.exists) {
      return res.status(404).json({ success: false, error: '找不到該作品' });
    }

    await docRef.delete();
    res.json({ success: true, message: '刪除成功' });
  } catch (error) {
    console.error('刪除失敗:', error);
    res.status(500).json({ success: false, error: '刪除失敗' });
  }
});

module.exports = router;
