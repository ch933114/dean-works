const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// 初始化 Firebase Admin
const serviceAccount = require('./firebaseKey.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});
const db = admin.firestore();

// 新增作品 API
app.post('/api/portfolio', async (req, res) => {
  const data = req.body;
  try {
    const docRef = await db.collection('portfolio').add(data);
    res.status(200).json({ id: docRef.id, message: '成功新增作品' });
  } catch (err) {
    res.status(500).json({ error: '新增失敗', details: err });
  }
});

// 測試用首頁
app.get('/', (req, res) => {
  res.send('Portfolio API 正在運作');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`伺服器啟動於 http://localhost:${PORT}`);
});
