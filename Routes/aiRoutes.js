const express = require('express');
const router = express.Router();
const { handleCommand, getPrompts, handleChat } = require('../controllers/aiController');
const { protectAny } = require('../middleware/authMiddleware');

router.post('/command', protectAny, handleCommand);
router.get('/prompts', getPrompts);
router.post('/chat', handleChat);

module.exports = router;
