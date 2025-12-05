const express = require('express');
const router = express.Router();
const { handleCommand } = require('../controllers/aiController');
const { protectAny } = require('../middleware/authMiddleware');

router.post('/command', protectAny, handleCommand);

module.exports = router;
