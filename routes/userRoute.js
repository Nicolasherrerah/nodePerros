const express = require('express');
const middle = require('../itemsInCart');
const router = express.Router();
const { pool } = require("../dbConfig");

router.get('/user', middle,(req, res) =>{
    let itemCount = req.count[0].count;
    res.render('user', 
    {
        itemCount,
        username: req.user.username,
        name: req.user.name,
        email: req.user.email
    });
});

module.exports = router; 