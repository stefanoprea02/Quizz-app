import Sequelize from "sequelize";
import { default as jsyaml } from 'js-yaml';
import { promises as fs } from 'fs';
import * as util from 'util';
import DBG from 'debug';
const log = DBG('users:model-users');
const error = DBG('users:error');

var sequlz;

export class SQUser extends Sequelize.Model{}

export async function connectDB(){
    if(sequlz) return sequlz;

    const yamlText = await fs.readFile(process.env.SEQUELIZE_CONNECT, 'utf8');
    const params = await jsyaml.load(yamlText, 'utf8');

    if (typeof process.env.SEQUELIZE_DBNAME !== 'undefined'
            && process.env.SEQUELIZE_DBNAME !== '') {
        params.dbname = process.env.SEQUELIZE_DBNAME;
    }
    if (typeof process.env.SEQUELIZE_DBUSER !== 'undefined'
            && process.env.SEQUELIZE_DBUSER !== '') {
        params.username = process.env.SEQUELIZE_DBUSER;
    }
    if (typeof process.env.SEQUELIZE_DBPASSWD !== 'undefined'
            && process.env.SEQUELIZE_DBPASSWD !== '') {
        params.password = process.env.SEQUELIZE_DBPASSWD;
    }
    if (typeof process.env.SEQUELIZE_DBHOST !== 'undefined'
            && process.env.SEQUELIZE_DBHOST !== '') {
        params.params.host = process.env.SEQUELIZE_DBHOST;
    }
    if (typeof process.env.SEQUELIZE_DBPORT !== 'undefined'
            && process.env.SEQUELIZE_DBPORT !== '') {
        params.params.port = process.env.SEQUELIZE_DBPORT;
    }
    if (typeof process.env.SEQUELIZE_DBDIALECT !== 'undefined'
            && process.env.SEQUELIZE_DBDIALECT !== '') {
        params.params.dialect = process.env.SEQUELIZE_DBDIALECT;
    }
    
    log('Sequelize params ' + util.inspect(params));

    sequlz = new Sequelize(params.dbname, params.username, params.password, params.params);

    SQUser.init({
        username: { type: Sequelize.STRING, unique: true },
        password: Sequelize.STRING,
        email: Sequelize.STRING,
        answers: Sequelize.STRING(2048)
    }, {
        sequelize: sequlz,
        modelName: 'SQUser'
    });
    await SQUser.sync();
}

export function userParams(req){
    return {
        username: req.params.username,
        password: req.params.password,
        email: req.params.email,
        answers: JSON.stringify(req.params.answers)
    }
}

export function sanitezUser(user){
    var ret = {
        id: user.username,
        username: user.username,
        email: user.email,
        answers: user.answers
    };
    return ret;
}

export async function findOneUser(username){
    let user = await SQUser.findOne({ where: { username: username } });
    user = user ? sanitezUser(user) : undefined;
    return user;
}

async function findPassword(username){
    let user = await SQUser.findOne({ where: { username: username } });
    user = user ? user.password : undefined;
    return user;
}

export async function createUser(req){
    let tocreate = userParams(req);
    await SQUser.create(tocreate);
    const result = await findOneUser(req.params.username);
    return result;
}

export async function updateUser(req){
    try{
        req.password = await findPassword(req.username);
        await SQUser.update(req, {where: {username: req.username}});
    }catch(e){
        console.debug(e);
    }
}