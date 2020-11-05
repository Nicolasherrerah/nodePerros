const express = require('express');
const itemsInCart = require('../itemsInCart');
const router = express.Router();
const { pool } = require("../dbConfig");

router.get('/shop', itemsInCart,(req, res) =>{
    let itemCount = req.count[0].count;
    res.render('shop',     
    {
        itemCount,
        username: req.user.username,
        name: req.user.name,
        email: req.user.email
    });
});

router.get('/shop/product/:productId', itemsInCart,(req, res)=>{
    let itemCount = req.count[0].count;
    pool.query(`SELECT * FROM products WHERE id = $1`, [req.params.productId], (err, results)=>{
        res.render('product', {
            itemCount,
            product: results.rows,
            username: req.user.username,
            name: req.user.name,
            email: req.user.email
        });

    })
});

router.post('/shop/product/:productId', (req, res)=>{
    let {quantity} = req.body;
    pool.query(`SELECT * FROM person WHERE id = $1`, [req.user.id], (err, results) => {
        if (err) {
          return done(err);
        }
        let user_id = results.rows[0].id;
        console.log(req.params);
        pool.query(`SELECT * FROM products WHERE id = $1`, [req.params.productId], (err, results)=>{
            if (err) {
                throw err;
            }
            let product = results.rows[0];
            console.log(product.category);
            pool.query(`INSERT INTO products_in_cart (category, productname, quantity, price, user_id)
            VALUES ($1, $2, $3, $4, $5)`, [product.category, product.productname, quantity, product.price, user_id], (err, results) =>{
                if (err) {
                    throw err;
                }
                req.flash("product_added","Added to cart");
                res.redirect('/shop');
                console.log(results.rows);
            })
        });
    });
});

module.exports = router; 