const { urlencoded } = require('body-parser');
const express = require('express');
const session = require('express-session');
const flash = require('express-flash');
const exphbs = require('express-handlebars')
const { pool } = require("./dbConfig");
const homePage = require('./routes/homePageRoute')
const appointmentPage = require('./routes/appointmentRoute')
const shopPage = require('./routes/shopRoute')
const checkOutPage = require('./routes/checkOutRoute')
const userPage = require('./routes/userRoute')
const bcrypt = require("bcrypt");
const passport = require("passport");
const initializePassport = require("./passportConfig");

const app = express();
initializePassport(passport);

app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

app.use(express.static(__dirname + '/public'));

app.use(express.urlencoded({extended: false}));

app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false,
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

//ROUTES 

app.use(homePage);
app.use(appointmentPage);
app.use(shopPage);
app.use(checkOutPage);
app.use(userPage);



app.get('/', checkAuthenticated, (req, res) =>{
    res.render('index');
});

app.get('/sign-up', checkAuthenticated, (req, res) =>{
    res.render('signUp');
});

app.get("/log-out", (req, res) => {
    req.logout();
    res.render("index", { message: "You have logged out successfully" });
});
  
app.post("/sign-up", async (req, res)=>{
    let { name, username, email, password, confirmpassword} = req.body;
    let errors = [];

    console.log({
        name,
        username,
        email,
        password,
        confirmpassword
    });


    if(!name || !username || !email || !password || !confirmpassword){
        errors.push({ message_fill: "Please enter all fields" });
    }

    if(password.length < 6 ){
        errors.push({ message_pass_length: "Password should be at least 6 characters"});
    }

    if(password !== confirmpassword){
        errors.push({message_pass_match : "Passwords do not match, try again."})
    }
    if(errors.length > 0){
        console.log(errors[0].message_fill);
        res.render("signup", { errors: errors[0], name, username, email, password, confirmpassword });
    }
    else{
        let hashedPassword = await bcrypt.hash(password, 10);

        pool.query(
            `SELECT * FROM person WHERE email = $1`, [email], (err, results) =>{
                if(err){
                    throw err;
                }
                console.log(results.rows);

                if(results.rows.length > 0){
                    errors.push({ message_email_exist: "Email already registered, try to" });
                    res.render("signup", { errors: errors[0] });
                }
                else{
                    pool.query(
                        `INSERT INTO person (name, username, email, password)
                        VALUES ($1, $2, $3, $4)
                        RETURNING id, password`,
                        [name, username, email, hashedPassword],
                        (err, results) =>{
                            if (err) {
                                throw err;
                            }
                            console.log(results.rows);
                            req.flash("success_msg","User registered successfully")
                            res.redirect('/');
                        }
                    );
                }
            });
    }
});

app.post("/", passport.authenticate("local", {
    successRedirect: "/home-page",
    failureRedirect: "/",
    failureFlash: true
    })
);


function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
      return res.redirect("/home-page");
    }
    next();
  }
  
function checkNotAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/");
}



app.listen(3000);
