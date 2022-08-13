import restify from 'restify';
import * as util from 'util';
import {
    SQUser, connectDB, userParams, findOneUser, createUser, sanitezUser, updateUser
} from './users-sequelize.mjs';
import { default as bcrypt } from 'bcrypt';

import DBG from 'debug';
const log = DBG('users:service');
const error = DBG('users:error');

var server = restify.createServer({
    name: "User-Auth-Service",
    version: "0.0.1"
});

server.use(restify.plugins.authorizationParser());
server.use(check);
server.use(restify.plugins.queryParser());
server.use(restify.plugins.bodyParser({
    mapParams: true
}));

server.listen(process.env.PORT, "localhost", function(){
    log(server.name + ' listening at ' + server.url);
});

process.on('uncaughtException', function(err) { 
    console.error("UNCAUGHT EXCEPTION - "+ (err.stack || err));
    process.exit(1);
});

process.on('unhandledRejection', (reason, p) => {
    console.error(`UNHANDLED PROMISE REJECTION: ${util.inspect(p)} reason: ${reason}`);
    process.exit(1);
});

server.post('/create-user', async(req, res, next) => {
    try{
        await connectDB();
        let result = await createUser(req);
        log('created ' + util.inspect(result));
        res.contentType = 'json';
        res.send(result);
        next(false);
    }catch(e){
        res.send(500, e);
        error(`/find-or-create ${e.stack}`);
        next(false);
    }
});

server.get('/find/:username', async(req, res, next) => {
    try{
        await connectDB();
        const user = await findOneUser(req.params.username);
        if(!user){
            res.send(404, new Error("Did not find " + req.params.username));
        }else{
            res.contentType = 'json';
            res.send(user);
        }
        next(false);
    }catch(e){
        res.send(500, e);
        next(false);
    }
});

server.get('/list', async(req, res, next) =>{
    try{
        await connectDB();
        let userlist = await SQUser.findAll({});
        userlist = userlist.map(user => sanitezUser(user));
        if(!userlist) userlist = [];
        res.contentType = 'json';
        res.send(userlist);
        next(false);
    }catch(e){
        res.send(500, e);
        error(`/find-or-create ${e.stack}`);
        next(false);
    }
});

server.post('/update-user/:username', async(req, res, next) => {
    try{
        await connectDB();
        let toupdate = userParams(req);
        await updateUser(toupdate);
        const result = await SQUser.findOne( {where: { username: req.params.username } });
        res.contentType = 'json';
        res.send(result);
        next(false);
    }catch(e){
        res.send(500, e);
        next(false);
    }
}); 

server.del('/destroy/:username', async(req, res, next) => {
    try{
        await connectDB();
        const user = await SQUser.findOne({where: {username: req.params.username } });
        if(!user){
            res.send(404, new Error(`Did not find requested ${req.params.username} username`));
        }else{
            user.destroy();
            res.contentType = 'json';
            res.send({});
        }
    }catch(e){
        res.send(500, e);
        next(false);
    }
});

server.post('/password-check', async(req, res, next) => {
    try{
        await connectDB();
        const user = await SQUser.findOne({ where: { username: req.params.username } });
        let checked;
        if(!user){
            checked = {
                check: false,
                username: req.params.username,
                message: "Could not find user"
            };
        }else{
            let pwcheck = false;
            if(user.username === req.params.username){
                pwcheck = await bcrypt.compare(req.params.password, user.password);
            }
            if(pwcheck){
                checked = {
                    check: true,
                    username: user.username
                };
            }else{
                checked = {
                    check: false,
                    username: req.params.username,
                    message: "Incorrect username or password"
                };
            }
        }
        res.contentType = 'json';
        res.send(checked);
        next(false);
    }catch(e){
        res.send(500, e);
        next(false);
    }
});

var apiKeys = [ { user: 'them', key: 'D4ED43C0-8BD6-4FE2-B358-7C0E230D11EF' } ];

function check(req, res, next) {
    log(`check ${util.inspect(req.authorization)}`);
    if (req.authorization && req.authorization.basic) {
        var found = false;
        for (let auth of apiKeys) {
            if (auth.key  === req.authorization.basic.password
             && auth.user === req.authorization.basic.username) {
                found = true;
                break;
            }
        }
        if (found) next();
        else {
            res.send(401, new Error("Not authenticated"));
            error('Failed authentication check '+ util.inspect(req.authorization));
            next(false);
        }
    } else {
        res.send(500, new Error('No Authorization Key'));
        error('NO AUTHORIZATION');
        next(false);
    }
}