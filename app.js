if(process.env.NODE_ENV!=="production"){  // for development phase only no production me like githup pe
require('dotenv').config();
}
// console.log(process.env);   yha process.env krna hi padta hai env ko use karne ke liye
const express=require("express");
const app=express();
const mongoose=require("mongoose");
// const Listing=require("./models/listing.js");
const path=require("path");
const methodOverride=require("method-override");
const ejsMate=require("ejs-mate"); 
// const wrapAsync=require("./utils/wrapAsync.js");
const ExpressError=require("./utils/ExpressError.js");
// const { required } = require("joi");
// const {listingSchema,reviewSchema}=require("./schema.js");
// const Review=require("./models/review.js");

const session=require("express-session")
const flash=require("connect-flash");
const passport=require("passport");
const LocalStrategy=require("passport-local");
const User= require("./models/user.js");

const listingRouter=require("./routes/listing.js");
const reviewRouter=require("./routes/review.js")
const userRouter=require("./routes/user.js");
const { log } = require('console');
const MONGO_URL="mongodb://127.0.0.1:27017/wanderlust";
main().then(()=>{
    console.log("connected to DB");     
}).catch((err)=>{
    console.log(err);
}) 
async function main(){
        await mongoose.connect(MONGO_URL);
      
}

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine('ejs',ejsMate);   //ejs-mate ka part hai
app.use(express.static(path.join(__dirname,"/public")));


// app.get("/testListing",async (req,res)=>{
//    let sampleListing=new Listing({
//       title:"my new villa",
//       description:"By the beach",
//       price:1200,
//       location:"calangute,Goa",
//       country:"india",
//    });
//    await sampleListing.save();
//    console.log(" sample was saved");
//    res.send("successful testing");
// });

// const validateListing=(req,res,next)=>{
//     let {error} =listingSchema.validate(req.body);
//     // console.log(result);
//     if(error){
//         let errMsg=error.details.map((el)=>el.message).join(",");
//         throw new ExpressError(400,errMsg);
//       } else{
//         next();
//       }
//  } 


//  const validateReview=(req,res,next)=>{
//     let {error} =reviewSchema.validate(req.body);
//     // console.log(result);
//     if(error){
//         let errMsg=error.details.map((el)=>el.message).join(",");
//         throw new ExpressError(400,errMsg);
//       } else{
//         next();
//       }
//  } 


// // INDEX ROUTE
// app.get("/listings", wrapAsync(async (req,res)=>{
//    let allListings=await  Listing.find({});
//    res.render("listings/index.ejs",{allListings});
// }));
// //NEW ROUTE
// app.get("/listings/new",(req,res)=>{
//   res.render("listings/new.ejs");  
// })


// // SHOW ROUTE
// app.get("/listings/:id",wrapAsync(async (req,res)=>{
//           let {id}=req.params;
//      const listing=await Listing.findById(id).populate("reviews");
//      res.render("listings/show.ejs",{listing});
// }))
// //CREATE ROUTE
// app.post("/listings",validateListing,wrapAsync(async (req,res,next)=>{

// //       let {title,description,image,price,country,location}=req.body
// //  if(!req.body.listing){
// //     throw new ExpressError(400,"send valid data for listing")
// //  }
// //  const newListing=new Listing(req.body.listing);
// //  if(!newListing.title){                       // this is for individual validdation
// //       throw new ExpressError(400,"Title is missing")
// // }
// // if(!newListing.description){                       // this is for individual validdation
// //       throw new ExpressError(400,"Description is missing")
// // }
// // if(!newListing.location){                       // this is for individual validdation
// //       throw new ExpressError(400,"Location is missing")
// // }// ye tarike me kafi effort lgega aor aise bhut sare model ho to it is unappropriate method
//   //isko easyly krne ke liye tool use krenge i.e JOI tool it is npm package 
//                      //OR//
//   let result=listingSchema.validate(req.body);
// //   console.log(result);
//     if(result.error){
//         throw new ExpressError(400,result.error)
//     }
//   const newListing=new Listing(req.body.listing);                 
//   await newListing.save();
// res.redirect("/listings");
// } 
// ) );

// //EDIT ROUTE
// app.get("/listings/:id/edit",wrapAsync(async (req,res)=>{
//       let {id}=req.params;
//      const listing=await Listing.findById(id);
//      res.render("listings/edit.ejs",{listing});
// }));

// // Update route
// app.put("/listings/:id",validateListing,wrapAsync(async (req,res)=>{
 
//     let {id}=req.params;
//    await Listing.findByIdAndUpdate(id,{...req.body.listing});
//    res.redirect(`/listings/${id}`)
// }))

// //DELETE ROUTE
// app.delete("/listings/:id",wrapAsync(async (req,res)=>{
//      let {id}=req.params;
//     let deletedListing= await Listing.findByIdAndDelete(id);
//     console.log(deletedListing);
//     await Listing.findByIdAndDelete(id);
//     res.redirect("/listings");    
// }));  
// inko comment isliye kiya gya h b/c ye routes me gye

const sessionOptions={
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized:true,
    cookie:{   // by default cokies ki koi expire date nhi hoti
      expires:Date.now()+7*24*60*60*1000,
      maxAge:7*24*60*60*1000,
      httpOnly:true,  //to prevent cross scripting attacs security 
    },
} 


app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

// use static authenticate method of model in LocalStrategy
passport.use(new LocalStrategy(User.authenticate())); 

// use static serialize and deserialize of model for passport session support
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
/// in sba chhej ko scrach  se bhi implement kr sktre the phle krna hi pdta tha 


app.use((req,res,next)=>{
  res.locals.success=req.flash("success");
   res.locals.error=req.flash("error");  
   res.locals.currUser=req.user;
  next();
})

app.use("/demo", async (req, res) => {
    const fakeUser = new User({
        email: "student@gmail.com",
        username: "Hariom jangid"
    });
    let registeredUser = await User.register(fakeUser, "hellobhai");
    res.send(registeredUser);
});

app.use("/listings",listingRouter)
app.use("/listings/:id/reviews",reviewRouter)
app.use("/",userRouter); 
// REVIEWS 
  //post review route

  // app.post("/listings/:id/reviews",validateReview ,wrapAsync(async(req,res)=>{
  //    let listing=await Listing.findById(req.params.id);
  //     let newReview=new Review(req.body.review)

  //     listing.reviews.push(newReview);
  //     await newReview.save()
  //     await listing.save()
      

  //     // console.log("new review saved");
  //     // res.send("new review saved");
  //     res.redirect(`/listings/${listing._id}`);
  // }));
// post delete route
// app.delete("/listings/:id/reviews/:reviewId", wrapAsync(async (req,res)=>{
//   let {id,reviewId}=req.params;

//   await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
//   await Review.findByIdAndDelete(reviewId);
//   res.redirect(`/listings/${id}`);
// }))

// app.all("*",(req,res, next)=>{  // jo route exits nhi krta uske liye ye error aayega
//     next(new ExpressError(404 , "Page not Found!"));
// });

app.use((err,req,res,next)=>{
    let {statusCode=500,message="Something went wrong!"}=err;
//    res.status(statusCode).send(message);
  res.status(statusCode).render("error.ejs",{err})
})

app.listen(8080,()=>{
    console.log("server is running to port 8080");    
});