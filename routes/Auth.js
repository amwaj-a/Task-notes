const express = require("express");
const passport = require("passport");
const router=express.Router()
const User=require('../models/User').user


router.get('/',ensureLogin,(req,res)=>{
    // console.log(req.user);
    res.render('home',{user:req.user})
    })
//  -----------------------Page Note-----------------------

router.get('/Notes',ensureLogin,async(req,res)=>{


   res.render('note' ,{user:req.user})
})

router.get('/more/:id',ensureLogin,async(req,res)=>{
const id=req.params.id;


req.user.note.forEach(element => { 


  if(element._id==id){

     return res.render('moreNote',{user:element})
  }
});
})

router.get('/AddNote',ensureLogin,(req,res)=>{

    res.render('AddNote',{user:req.user})
})

router.post('/AddNote/:id',ensureLogin,async(req,res)=>{
const a = await User.findById(req.params.id)
a.note.push({title:req.body.title,body:req.body.body})
await a.save()

  res.redirect('/Notes')
})
router.post('/delete/:id',ensureLogin,async(req,res)=>{
 const a=req.user.note;

  a.forEach(async e=>{
    if(e._id==req.params.id)
    { 
      const b=await User.updateOne({_id:req.user._id},{$pull : {"note" : {_id:req.params.id}}});

   
    }
  })

  
    res.redirect('/Notes')
  })
  
  

//  -----------------------Page Task-----------------------
router.get('/Taskes',ensureLogin,async(req,res)=>{

   res.render('task' ,{user:req.user})
})


router.get('/AddTask',ensureLogin,(req,res)=>{
    res.render('AddTask',{user:req.user})
})

router.post('/AddTask/:id',ensureLogin,async(req,res)=>{
  const c=req.body['isCompleted'] ? true : false
     const id=req.params.id
  const a=await User.findById(id) // a={name:..., email:...,task:[],...}  
  a.task.push({title:req.body.title,isCompleted:c})
  
  await a.save()
   res.render('task',{user:a}) 
 
  
  })

router.post('/change/:id',ensureLogin,async(req,res)=>{
const id=req.params.id;

    // const a=await User.findById();
    req.user.task.forEach(element => {
       if(element._id==id){
         element.isCompleted=!element.isCompleted
       }
     
     }); 

    await req.user.save()
  res.redirect('/Taskes')
   
    
    })
    
router.post('/deleted/:id',ensureLogin,async(req,res)=>{
      const id=req.params.id;

          req.user.task.forEach(async (element)=> {

             if(element._id==id){
              const b=await User.updateOne({_id:req.user._id},{$pull : {"task" : {_id:id}}});
    
      
            }
           
           }); 
     

        res.redirect('/Taskes')
         
          
          })
          
  
//  -----------------------LogOut-----------------------

router.get('/logout', function(req, res){
      req.logout();
      res.redirect('/login');
    });


//  -----------------------Login-----------------------

router.get('/login',(req,res)=>{
  const massage=req.flash('error')[0]

    res.render('login',{massage})
   
})

router.post('/login',passport.authenticate('local',{ failureFlash: true, successRedirect:'/',failureRedirect:'/login'}
)
)
//  -----------------------Register-----------------------

router.get('/register',(req,res)=>{
  console.log("-------------------------");
    console.log(req.flash('error'));
    res.render('main',{error:req.flash('error')})
   
})

router.post('/register', (req,res)=>{
    const {username,password}=req.body
    try {
        if(username===''|| password===''){
            res.render('main',{error:'Indicate an email and password'})
   
       }
       // Email EXISTS
       User.findOne({username}).then((user)=>{
        if(user!== null)
            res.render('main',{error:'The Email already exists'})
   
       }).catch((err)=>{
        console.log("---------============================------------");

           console.log("error");
       })


   const a=new User(req.body)

      User.register(a,req.body.password,((err,user)=>{
        if(err){    
           console.log("-----------+++++++++++++++++++++----------");

                           console.log(err)
                           }else{

      //   let authenticate = User.authenticate();
      //   authenticate('username', 'password', function(err, result) {
      //     if (err) { console.log(err);}})

      res.redirect('/login')
                           }
   
      }))
 
    } catch (error) {
     console.log("Erorr Catch=====================");
     console.log(error);   
    }
    
    // //   const  Users=new User({email:req.body.email,username:req.body.username})
    // } catch (error) {
    //         req.flash('error',error)
    //         console.log(error);
    // res.render('main',{error:req.flash('error')})

    // }

})
function ensureLogin(req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    } else {
      return res.redirect('/login');
    }
  }

// router.get('/login',(req,res)=>{
//     res.render('login')
// })
// router.post('/login',async(req,res)=>{
//     console.log(req.body);
//     const {email,password}=req.body
//     try {
//  const UserLogin=await user.findOne({email})
//     console.log(UserLogin )
//     if(!UserLogin){
//       res.render('login',{error:'Login-Email'})
//     }

//     // <!-- <%- if(error=='') %> -->
 
//     // <!-- <%- else if(error=='Login-Email'){ %>  -->
             
//     //           <!-- <%- } %>  -->

//     } catch (error) {
//         console.log(error);
//     }

//     // console.log("Email is Exite");
// })

// router.get('/Singup',(req,res)=>{
//     res.render('main',{title:false})
// })

// router.post("/Signup",async(req,res)=>{
//     const email=req.body.email;
// try {

//     let user=await UserModel.findOne({email})
//     if(user){
//   return res.render('main',{title:false ,error:'Email already exists'})
//  }  
// user=new UserModel(req.body)

// await user.save().then(result =>{
//     console.log(result);
//     console.log("successful");
//     res.render('main',{title:true,user:result,error:''})
// }).catch(err=> console.log(err)) 

// } catch (error) {
//     console.log(error);
// }

//   })
  
// // router.post("/Signup",(req,res)=>{
// //   const a= new user(req.body) 
// //   a.sava().then(result =>{
// //       console.log(result);
// //       res.render('main',{title:true,user:result})
// //   }).catch(err=> console.log(err)) 
// // })
module.exports=router


