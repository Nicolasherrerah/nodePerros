const express = require('express');
const itemsInCart = require('../itemsInCart');
const router = express.Router();
const { pool } = require("../dbConfig");
const { response } = require('express');

router.get('/home-page', itemsInCart, (req, res) =>{
    console.log("test", req.count);
    let itemCount = req.count[0].count;
    let products = [];
    let product_quantity = [];
    pool.query(`SELECT * FROM person WHERE id = $1`, [req.user.id], (err, results) => {
        if (err) {
          return done(err);
        }
        let owner_id = results.rows[0].id;
        //console.log("owner", owner_id)
        pool.query(`SELECT *, to_char(birthday, 'yyyy-MM-dd') FROM dog WHERE owner_id = $1`, [owner_id], (err, results) =>{
            //console.log(results.rows);
            if(err){
                return done(err);
            }
            let dogs = results.rows;
            pool.query(`SELECT *, to_char(date, 'yyyy-MM-dd') FROM appointment JOIN dog ON appointment.dog_id = dog.id`, (err, results) =>{
                //console.log("doggies", results.rows);
                if(err){
                    return done(err);
                }
                let appointments = results.rows;
                pool.query(`SELECT *, to_char(delivery_date, 'yyyy-MM-dd') FROM ordered WHERE user_id = $1`, [owner_id], (err, results)=>{
                    if(err){
                        throw err;
                    }
                    let orders = results.rows;
                    orders.forEach(order =>{
                        let isDigit = /\d/g;
                        let productIdArray = order.product_ids.split(',')
                        let quantityArray = order.product_quantity.split(',')
                        productIdArray.forEach(productId =>{                           
                            pool.query(`SELECT * FROM products WHERE id = $1`, [productId.match(isDigit).join('')], (err, results) =>{
                                if (err) {
                                    throw err
                                }
                                quantityArray.forEach(productQuantity =>{
                                    product_quantity.push(productQuantity.match(isDigit).join(''))
                                    results.rows[0].quantity = productQuantity.match(isDigit).join('');
                                })
                                products.push(...results.rows);
                                console.log('Products', products);

                            })
                        })
                    })
                    setTimeout(()=> res.render('homepage',
                    {
                    orders,
                    products,
                    itemCount,
                    dogs,
                    appointments,
                    username: req.user.username,
                    name: req.user.name,
                    email: req.user.email
                    }), 2000 )  
                })
            })
        })
    }); 
});

router.get('/home-page/pets/:id', itemsInCart,(req, res) =>{
    let itemCount = req.count[0].count;
    pool.query(`SELECT * FROM person WHERE id = $1`, [req.user.id], (err, results) => {
        if (err) {
          return done(err);
        }
        pool.query(`SELECT *, to_char(birthday, 'yyyy-MM-dd') FROM dog WHERE id = $1`, [req.params.id], (err, results) =>{
            console.log(results.rows);
            if(err){
                return done(err);
            }
            let info = results.rows[0];
            res.render('homepage-pets', {
                itemCount,
                info,
                username: req.user.username,
                name: req.user.name,
                email: req.user.email
            })

        })
    }); 
});

router.get('/home-page/pets/edit/:id', itemsInCart,(req, res) =>{
    let itemCount = req.count[0].count;
    pool.query(`SELECT * FROM person WHERE id = $1`, [req.user.id], (err, results) => {
        if (err) {
          return done(err);
        }
        pool.query(`SELECT *, to_char(birthday, 'yyyy-MM-dd') FROM dog WHERE id = $1`, [req.params.id], (err, results) =>{
            console.log(results.rows);
            if(err){
                return done(err);
            }
            let info = results.rows[0];
            res.render('homepage-pets-edit', {
                itemCount,
                info,
                username: req.user.username,
                name: req.user.name,
                email: req.user.email
            })

        })
    }); 
});

router.post("/home-page", (req, res)=>{
    let { dogName, dogBreed, dogAge, dogBirth, dogPicture} = req.body;
    //console.log({ dogName, dogBreed, dogAge, dogBirth, dogPicture});
    pool.query(`SELECT * FROM person WHERE id = $1`, [req.user.id], (err, results) => {
        if (err) {
          return done(err);
        }
        let owner_id = results.rows[0].id;
        pool.query(
            `INSERT INTO dog (name, breed, age, birthday, img, owner_id)
            VALUES ($1, $2, $3, $4, $5, $6)`,
            [dogName, dogBreed, dogAge, dogBirth, dogPicture, owner_id],
            (err, results) =>{
                if (err) {
                    throw err;
                }
                req.flash("success_msg","Pet added")
                //console.log(results.rows);
                res.redirect('/home-page')
            });
    });
});

router.post('/home-page/pets/update/:id', (req, res)=>{
    let { name, breed, age, birthday} = req.body;

    pool.query(`SELECT * FROM person WHERE id = $1`, [req.user.id], (err, results) => {
        if (err) {
          throw err;
        }
        let user_id = results.rows[0].id;
        pool.query(`UPDATE dog SET name = $1, breed = $2, age = $3, birthday= $4 WHERE id = $5`, 
        [name, breed, age, birthday, req.params.id], (err, results)=>{
            if (err) {
                throw err;
            }
            req.flash("edit_pet_msg","Pet information updated");        
            res.redirect('/home-page/pets/'+ req.params.id);
        });
    });
});


module.exports = router; 