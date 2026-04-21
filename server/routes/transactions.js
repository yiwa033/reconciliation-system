/**
 * 交易记录路由
 */

const express = require('express');
const router = express.Router();

const transactions = [];

/**
 * GET /api/transactions
 * 获取交易列表
 */
router.get('/', (req, res) => {
  const { skip = 0, limit = 20, gameName } = req.query;
  
  let filtered = transactions;
  
  if (gameName) {
    filtered = filtered.filter(t => t.gameName.includes(gameName));
  }

  const paginated = filtered.slice(parseInt(skip), parseInt(skip) + parseInt(limit));
  
  res.json({
    total: filtered.length,
    data: paginated
  });
});

/**
 * POST /api/transactions
 * 上传交易数据
 */
router.post('/', (req, res) => {
  try {
    const tx = req.body;
    
    if (!tx.gameName || tx.rechargeFlow === undefined) {
      return res.status(400).json({ error: '缺少必要字段' });
    }

    const newTx = {
      id: transactions.length + 1,
      ...tx,
      createdAt: new Date()
    };

    transactions.push(newTx);
    res.status(201).json(newTx);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;