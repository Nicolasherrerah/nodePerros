const { pool } = require("./dbConfig");

function itemsInCart(req, res, next){
    pool.query(`SELECT COUNT(*) FROM products_in_cart WHERE user_id = $1`, [req.user.id], (err, results)=>{
        if(err){
            throw err;
        }
        req.count = results.rows;
        return next();
    })
}

module.exports = itemsInCart;