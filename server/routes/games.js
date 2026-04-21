const express = require('express');
const router = express.Router();
const games = [
  { id: 1, name: '未世王者（大魅）', status: 'active' },
  { id: 2, name: '幸世王者（渠道）', status: 'active' }
];
router.get('/', (req, res) => {
  res.json({ total: games.length, data: games });
});
router.post('/', (req, res) => {
  try {
    const { name, status } = req.body;
    if (!name) {
      return res.status(400).json({ error: '游戏名称不能为空' });
    }
    const newGame = { id: games.length + 1, name, status: status || 'active' };
    games.push(newGame);
    res.status(201).json(newGame);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
router.get('/:id', (req, res) => {
  const game = games.find(g => g.id === parseInt(req.params.id));
  if (!game) {
    return res.status(404).json({ error: '游戏不存在' });
  }
  res.json(game);
});
router.put('/:id', (req, res) => {
  const game = games.find(g => g.id === parseInt(req.params.id));
  if (!game) {
    return res.status(404).json({ error: '游戏不存在' });
  }
  Object.assign(game, req.body);
  res.json(game);
});
module.exports = router;