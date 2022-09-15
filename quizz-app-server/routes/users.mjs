import path from 'path';
import util from 'util';
import { default as express } from 'express';
import { default as passport } from 'passport';
import { default as passportLocal } from 'passport-local';
const LocalStrategy = passportLocal.Strategy;
import * as usersModel from '../models/user-superagent.mjs';
import { sessionCookieName } from '../app.mjs';

export const router = express.Router();
import DBG from 'debug';
const debug = DBG('quizz:router-users');
const error = DBG('quizz:error-users');

let obj;

router.post("/login",
  passport.authenticate("local", {failureRedirect: 'http://localhost:3000/Login'}),
    function(req, res){
      res.redirect(req.headers.origin);
});

router.get('/loggedin', function(req, res, next) {
  if(req.user !== undefined){
    obj = { ok: "da" };
  }else{
    obj = { ok: "nu" };
  }
  res.send(obj);
});

router.post("/create", async(req, res, next)=>{
  try{
    let answers = [0, 0];
    var u = await usersModel.create(req.body.username, req.body.password, req.body.email, answers);
    res.send(u);
  }catch(e){
    next(e);
  }
});

router.get('/logged-user', function(req, res, next) {
  try{
    res.send(req.user);
  }catch(e){
    next(e);
  }
});

router.post('/find-user', async(req, res, next) => {
  try{
    const user = await usersModel.find(req.body.username);
    if(!user)
      res.send({user: "$nouser"})
    else
      res.send({user: `${user.username}`});
  }catch(e){
    next(e);
  }
})

router.post('/update', async(req, res, next) => {
  try{
    const user = await usersModel.find(req.body.username);

    let string = user.answers;
    string = string.replace("[", "");
    string = string.replace("]", "");
    let a = string.split(",");
    a[0] = parseInt(a[0]);
    a[1] = parseInt(a[1]);
    a = [a[0] + req.body.corAns, a[1] + req.body.incAns];
    user.answers = a;
    let parola = "parola";
    var u = await usersModel.update(user.username, parola, user.email, user.answers);
    res.send(u);
  }catch(e){
    console.debug(e);
    next(e);
  }
});

router.get('/destroy', async(req, res, next) => {
  try{
    const destroy = await usersModel.destroy(req.user.username);
    req.session.destroy();
    req.logout();
    res.clearCookie(sessionCookieName);
    res.redirect('/');
  }catch(e){
    console.debug(e);
    next(e);
  }
});

router.get('/logout', function(req, res, next) {
  try{
      req.session.destroy();
      req.logout();
      res.clearCookie(sessionCookieName);
      res.redirect('/');
  }catch(e){
      next(e);
  }
});

LocalStrategy.passReqToCallback = true;  
passport.use(new LocalStrategy(
  async(username, password, done) => {
      try{
          var check = await usersModel.userPasswordCheck(username, password);
          if(check.check){
              done(null, {id: check.username, username: check.username});
          }else{
              done(null, false, check.message);
          }
      }catch(e){
          debug(e);
          next(e);
      }
  }
));

passport.serializeUser(function(user, done) {
  try {
      done(null, user.username);
  } catch (e) { done(e); }
 });

passport.deserializeUser(async (username, done) => {
  try {
      var user = await usersModel.find(username);
      done(null, user);
  } catch(e) { done(e); }
});

export function initPassport(app){
  app.use(passport.initialize());
  app.use(passport.session());
}

export function ensureAuthenticated(req, res, next){
  try{
      if(req.user) next();
      else res.redirect(req.headers.origin + '/users/login');
  }catch(e) { next(e); }
}