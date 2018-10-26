const keys  = require('./keys');

const passport = require('passport');
const LinkedInStrategy = require('passport-linkedin-oauth2').Strategy;
const User = require('../models/user-model');


passport.serializeUser((user,done) => {
    done(null,user.id);
})

passport.deserializeUser((id,done) => {
    User.findById(id).then(user => done(null,user))
});

passport.use(
    new LinkedInStrategy({
        //options for linkedin strategy
        clientID: keys.linkedIn.clientId,
        clientSecret: keys.linkedIn.clientSecret,
        callbackURL: '/auth/linkedin/redirect',
        scope: ['r_basicprofile']
    }, (accessToken, refreshToken, profile, done) => {
        console.log(profile);
        //passport callback
        User.findOne({linkedinId:profile.id}).then(currentUser => {
            if(currentUser){
                // console.log('current user is: \n' + currentUser);
                done(null, currentUser);
            } else {
                new User({
                    username: profile.displayName,
                    linkedinId: profile.id,
                    job: profile._json.headline,
                    link: profile._json.publicProfileUrl,
                    thumbnail: profile.photos[profile.photos.length-1].value
                })
                .save()
                .then( newUser => {
                    done(null, newUser);
                })
            }
        })
    })
)