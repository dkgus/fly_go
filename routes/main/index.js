const express = require('express');
const router = express.Router();
const { sequelize, Sequelize : { QueryTypes } } = require('../../models');



router.get("/", (req, res, next) => {
    res.render('main/mainPage');
});
module.exports = router;
