const express=require('express')
const app=express()
const mongoose=require('mongoose')
const Auth=require('./routes/Auth')
const session=require('express-session')
const passport=require('passport')
const StrategyLocal=require('passport-local').Strategy
const flash=require('connect-flash')
const User = require('./models/User').user
const port=3999
const helmet=require('helmet')


// Auto Refresh-----------------------------------------------------------
const path = require("path");
const livereload = require("livereload");
const liveReloadServer = livereload.createServer();
liveReloadServer.watch(path.join(__dirname, 'public'));
const connectLivereload = require("connect-livereload");
app.use(connectLivereload()); 
liveReloadServer.server.once("connection", () => {
  setTimeout(() => {
    liveReloadServer.refresh("/");
  }, 100);
});



// mongodb connect 
mongoose.connect('mongodb+srv://amwaj:Mm122333@cluster0.eymts.mongodb.net/UsersTask?retryWrites=true&w=majority')
.then(res=> console.log("Connect DB"))
.catch(err=> console.log(err))




// file ejs and css and middelawer
app.set('view engine','ejs')
app.use(express.static('public'))
app.use(express.json())
app.use(express.urlencoded({extended:false}))
app.use(flash())
app.use(helmet())
app.use(session({
  secret:'Amwaj',
  saveUninitialized:true,
  resave:false,
  cookie:{maxAge  :1000*60*60}
}))

// passport.initialize
app.use(passport.initialize())
app.use(passport.session())

// passport will save session login . must be serializeUser 
// passport.serializeUser(User.serializeUser())
// passport.deserializeUser(User.deserializeUser())

// define Strategy
passport.use(new StrategyLocal(User.authenticate()))

passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

app.use('/',Auth)





// function isLogin(req, res, next) {
//   if(req.isAuth)
// }

app.listen(process.env.PORT||port,()=>{
  console.log("Successful ");
})


