require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

const authRoutes = require('./routes/auth');
const portfolioRouter = require('./routes/portfolio');
const usersRouter = require('./routes/users');

// 登入用
app.use('/auth', authRoutes);
// 作品資料
app.use('/portfolio', portfolioRouter);
// 使用者管理
app.use('/user', usersRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`伺服器運行中 http://localhost:${PORT}`);
});
