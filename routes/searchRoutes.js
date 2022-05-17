const express = require('express');
const router = express.Router();
const searchController = require('./../controller/searchController');

router.route('/').post(searchController.multiMatch);

router.route('/:index').get(searchController.multiMatch);

module.exports = router;