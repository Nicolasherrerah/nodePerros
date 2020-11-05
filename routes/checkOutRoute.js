const express = require('express');
const itemsInCart = require('../itemsInCart');
const router = express.Router();
const { pool } = require("../dbConfig");


router.get('/check-out', itemsInCart,(req, res) =>{
    let itemCount = req.count[0].count;
    pool.query(`SELECT * FROM person WHERE id = $1`, [req.user.id], (err, results) => {
        if (err) {
          return done(err);
        }
        let user_id = results.rows[0].id;
        console.log("owner", user_id)
        pool.query(`SELECT * FROM products_in_cart WHERE user_id = $1`, [user_id], (err, results) =>{
            console.log(results.rows);
            if(err){
                return done(err);
            }
            let inCart = results.rows;
            pool.query(`SELECT SUM(price * quantity) AS total FROM products_in_cart WHERE user_id = $1;`, [user_id], (err, results)=>{
                if(err){
                    throw err;
                }
                if(results.rows[0].total < 25){
                    res.render('checkOut', 
                    {   
                        shipping: '$ 5.00',
                        itemCount,
                        total: 5 + parseFloat(results.rows[0].total),
                        inCart,
                        username: req.user.username,
                        name: req.user.name,
                        email: req.user.email
    
                    })
                }
                else{
                    res.render('checkOut', 
                    {
                        shipping: 'FREE',
                        itemCount,
                        total: results.rows[0].total,
                        inCart,
                        username: req.user.username,
                        name: req.user.name,
                        email: req.user.email
    
                    })
                }

            })
        });
    }); 
});

router.get('/check-out/remove/:id', itemsInCart,(req, res) =>{
    pool.query(`DELETE FROM products_in_cart WHERE id = $1`, [req.params.id], (err, results)=>{
        if (err) {
            throw err;
        }
    });
    res.redirect('/check-out')
});

router.get('/payment', (req, res)=>{
    const timeElapsed = Date.now();
    const delivery_date = new Date(timeElapsed);
    delivery_date.setDate(delivery_date.getDate() + 7);
    let date = delivery_date.toISOString().split('T');
    //console.log('shipping', shippingPrice);
    pool.query(`SELECT * FROM person WHERE id = $1`, [req.user.id], (err, results) => {
        if (err) {
          return done(err);
        }
        let user_id = results.rows[0].id;
        //console.log("owner", user_id)
        pool.query(`SELECT * FROM products_in_cart WHERE user_id = $1`, [user_id], (err, results) =>{
            //console.log(results.rows);
            if(err){
                return done(err);
            }
            let inCart = results.rows;
            pool.query(`SELECT SUM(price * quantity) AS total FROM products_in_cart WHERE user_id = $1;`, [user_id], (err, results)=>{
                if(err){
                    throw err;
                }
                if(results.rows[0].total < 25){
                    res.render('payment', 
                    {   
                        date: date[0],
                        shipping: '$ 5.00',
                        total: 5 + parseFloat(results.rows[0].total),
                        inCart,
                        username: req.user.username,
                        name: req.user.name,
                        email: req.user.email
    
                    })
                }
                else{
                    res.render('payment', 
                    {
                        date: date[0],
                        shipping: 'FREE',
                        total: results.rows[0].total,
                        inCart,
                        username: req.user.username,
                        name: req.user.name,
                        email: req.user.email
    
                    })
                }
            })
        });
    }); 
});

router.post('/payment/shipping', (req, res)=>{
    let {standard, priority, express} = req.body;
    console.log(standard, priority, express);
    res.redirect('/payment');
});

router.post('/payment/finish-order', (req, res)=>{
    const timeElapsed = Date.now();
    const delivery_date = new Date(timeElapsed);
    delivery_date.setDate(delivery_date.getDate() + 7);
    let {standard, priority, express} = req.body;
    console.log(standard, priority, express);
    let product_id = [];
    let product_quantity = [];
    pool.query(`SELECT * FROM person WHERE id = $1`, [req.user.id], (err, results) => {
        if (err) {
            throw err;
        }
        let user_id = results.rows[0].id;
        pool.query(`SELECT * FROM products_in_cart WHERE user_id = $1`, [user_id], (err, results) =>{
            if(err){
                throw err;
            }
            let products_in_cart = results.rows;
            products_in_cart.forEach(product =>{
                product_id.push(product.id);
                product_quantity.push(product.quantity)
            })
            pool.query(`SELECT SUM(price * quantity) AS total FROM products_in_cart WHERE user_id = $1;`, [user_id], (err, results)=>{
                if(err){
                    throw err;
                }
                let order_price = "";
                //results.rows[0].total;
                if(results.rows[0].total < 25){
                    order_price = parseFloat(results.rows[0].total) + 5 ;
                }
                else{
                    order_price = results.rows[0].total;
                }
                console.log(order_price, product_id);
                pool.query(`INSERT INTO ordered (product_ids, user_id, order_price, delivery_date, product_quantity) VALUES ($1, $2, $3, $4, $5)`,
                [product_id, user_id, order_price, delivery_date, product_quantity], (err, results)=>{
                    if (err) {
                        throw err
                    }
                });
                pool.query(`DELETE FROM products_in_cart WHERE user_id = $1`, [user_id], (err, results)=>{
                    if (err) {
                        throw err
                    }
                    req.flash("created_order_msg", "Finished order");
                    res.redirect('/home-page')
                });
            })
        });
    });  
});



module.exports = router; 