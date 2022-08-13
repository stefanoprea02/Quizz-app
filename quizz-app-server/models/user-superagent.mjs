import { default as request } from 'superagent';
import util from 'util';
import url from 'url';
const URL = url.URL;
import DBG from 'debug';
const debug = DBG('quizz:users-superagent');
const error = DBG('quizz:error-superagent'); 

var authid = 'them';
var authcode = 'D4ED43C0-8BD6-4FE2-B358-7C0E230D11EF';

import { default as bcrypt } from 'bcrypt';
const saltRounds = 10;
async function hashpass(password) {
    let salt = await bcrypt.genSalt(saltRounds);
    let hashed = await bcrypt.hash(password, salt);
    return hashed;
}

function reqUrl(path){
    const requrl = new URL(process.env.USER_SERVICE_URL);
    requrl.pathname = path;
    return requrl.toString();
}

export async function create(username, password, email, answers){
    var res = await request
        .post(reqUrl('/create-user'))
        .send({username, password: await hashpass(password), email, answers})
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .auth(authid, authcode);
    return res.body;
}

export async function find(username) {
    try{
        var res = await request
        .get(reqUrl(`/find/${username}`))
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .auth(authid, authcode);
        return res.body;
    }catch(e){
        //console.debug(e);
    }
}

export async function update(username, password, email, answers){
    try{
        var res = await request
        .post(reqUrl(`/update-user/${username}`))
        .send({username, password, email, answers})
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .auth(authid, authcode);
        return res.body;
    }catch(e){
        console.debug(e);
    }
}

export async function destroy(username){
    try{
        var res = await request
        .del(reqUrl(`/destroy/${username}`))
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .auth(authid, authcode);
        return res.body;
    }catch(e){
        console.debug(e);
    }
}

export async function userPasswordCheck(username, password) {
    var res = await request
    .post(reqUrl(`/password-check`))
    .send({ username, password })
    .set('Content-Type', 'application/json')
    .set('Accept', 'application/json')
    .auth(authid, authcode);
    return res.body;
}

export async function listUsers() {
    var res = await request
    .get(reqUrl('/list'))
    .set('Content-Type', 'application/json')
    .set('Accept', 'application/json')
    .auth(authid, authcode);
    return res.body;
}