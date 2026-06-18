const express = require("express");
const router = express.Router();

const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const userController=require("../controllers/users.js");


router.route("/signup")
    .get(userController.renderSignup)
    .post(wrapAsync(userController.signup));

router.route("/login")
    .get(userController.renderLogin)
    .post(saveRedirectUrl, passport.authenticate("local",
        {
            failureRedirect: "/login",
            failureFlash: true
        }),
       userController.login
    ).post(saveRedirectUrl, passport.authenticate("local",
    {
        failureRedirect: "/login",
        failureFlash: true
    }),
   userController.login
);

// It verifies the username and password using the local strategy.
// If authentication fails, it redirects to /login and flashes an error.

router.get("/logout",userController.logout );

module.exports = router;