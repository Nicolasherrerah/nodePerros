const express = require('express');
const itemsInCart = require('../itemsInCart');
const router = express.Router();
const { pool } = require("../dbConfig");

router.get('/appointments', itemsInCart,(req, res) =>{
    let itemCount = req.count[0].count;
    pool.query(`SELECT * FROM person WHERE id = $1`, [req.user.id], (err, results) => {
        if (err) {
          return done(err);
        }
        let owner_id = results.rows[0].id;
        //console.log("owner", owner_id)
        pool.query(`SELECT * FROM appointment WHERE user_id = $1`, [owner_id], (err, results) =>{
            console.log('appos', results.rows);
            if(err){
                return done(err);
            }
            pool.query(`SELECT *, to_char(date, 'yyyy-MM-dd') FROM dog JOIN appointment ON dog.id = appointment.dog_id`, (err, results) =>{
                console.log("doggies", results.rows);
                if(err){
                    return done(err);
                }
                let appointments = results.rows;
                pool.query(`SELECT * FROM dog WHERE owner_id = $1`, [owner_id],(err, results) =>{
                    if(err){
                        return done(err);
                    }
                    res.render('appointment',
                    {
                    itemCount,
                    appointments,
                    dogs: results.rows,
                    username: req.user.username,
                    name: req.user.name,
                    email: req.user.email
                    }    
                    );
                });
            });
        });
    }); 
});

router.get('/appointments/edit/:id', itemsInCart,(req, res) =>{
    let itemCount = req.count[0].count;
    pool.query(`SELECT * FROM person WHERE id = $1`, [req.user.id], (err, results) => {
        if (err) {
          return done(err);
        }
        let owner_id = results.rows[0].id;
        //console.log("owner", owner_id)
        pool.query(`SELECT * FROM appointment WHERE user_id = $1`, [owner_id], (err, results) =>{
            console.log('appos', results.rows);
            if(err){
                return done(err);
            }
            pool.query(`SELECT *, to_char(date, 'yyyy-MM-dd') FROM appointment WHERE id = $1`, [req.params.id],(err, results) =>{
                console.log("doggies", results.rows);
                if(err){
                    return done(err);
                }
                let appointment = results.rows[0];
                pool.query(`SELECT * FROM dog WHERE id = $1`, [appointment.dog_id], (err, results)=>{
                    res.render('appointment-edit',
                    {
                    itemCount,
                    appointment,
                    dog: results.rows[0],
                    username: req.user.username,
                    name: req.user.name,
                    email: req.user.email
                    });
                })
            });
        });
    }); 
});

router.get('/appointments/remove/:id', (req, res) =>{
    console.log('test');
    pool.query(`DELETE FROM appointment WHERE id = $1`, [req.params.id], (err, results)=>{
        if (err) {
            throw err;
        }
        console.log(results.rows);
    });
    res.redirect('/appointments')
});

router.post("/appointments/new-appointment", (req, res)=>{
    let { date, purpose, dog_id} = req.body;
    console.log({ date, purpose, dog_id});
    pool.query(`SELECT * FROM person WHERE id = $1`, [req.user.id], (err, results) => {
        if (err) {
          return done(err);
        }
        let user_id = results.rows[0].id;
        pool.query(
            `INSERT INTO appointment (date, purpose, user_id, dog_id)
            VALUES ($1, $2, $3, $4)`,
            [date, purpose, user_id, dog_id],
            (err, results) =>{
                if (err) {
                    throw err;
                }
                req.flash("new_appointment_msg","Appointment added");        
                res.redirect('/appointments');
                console.log(results.rows);
            }
        );

    });
});

router.post('/appointments/edit-appointment/:id', (req, res)=>{
    let { date, purpose, dog_id} = req.body;
    console.log({ date, purpose, dog_id});
    pool.query(`SELECT * FROM person WHERE id = $1`, [req.user.id], (err, results) => {
        if (err) {
          throw err;
        }
        let user_id = results.rows[0].id;
        pool.query(`UPDATE appointment SET date = $1, purpose = $2, user_id = $3, dog_id= $4 WHERE id = $5`, 
        [date, purpose, user_id, dog_id, req.params.id], (err, results)=>{
            if (err) {
                throw err;
            }
            req.flash("edit_appointment_msg","Appointment updated");        
            res.redirect('/appointments');
        });
    });
});

module.exports = router; 