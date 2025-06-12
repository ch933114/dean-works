const express = require('express');
const app = express();

const portfolioRouter = require('./routes/portfolio');
app.use('/portfolio', portfolioRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`伺服器運行中 http://localhost:${PORT}`);
});
