import { program } from 'commander';
import { default as restify } from 'restify-clients';
import * as util from 'util';
import { default as bcrypt } from 'bcrypt';
const saltRounds = 10;

var client_port;
var client_host;
var client_version = '*';
var client_protocol;
var authid = 'them';
var authcode = 'D4ED43C0-8BD6-4FE2-B358-7C0E230D11EF';

async function hashpass(password){
    let salt = await bcrypt.genSalt(saltRounds);
    let hashed = await bcrypt.hash(password, salt);
    return hashed;
}

const client = (program) => {
    if(typeof process.env.PORT === 'string')
        client_port = Number.parseInt(process.env.PORT);
    if (typeof program.port === 'string') 
        client_port = Number.parseInt(program.port);
    if (typeof program.host === 'string') 
        client_host = program.host;
    if(typeof program.url === 'string'){
        let purl = new URL(program.url);
        if(purl.host && purl.host !== '')
            client_host = purl.host;
        if(purl.port && purl.port !== '')
            client_port = purl.port;
        if(purl.protocol && purl.protocol !== '')
            client_protocol = purl.protocol;
    }

    let connect_url = new URL('http://localhost:5858');
    if (client_protocol) connect_url.protocol = client_protocol;
    if (client_host) connect_url.host = client_host;
    if (client_port) connect_url.port = client_port;

    let client = restify.createJsonClient({
        url: connect_url.href,
        version: client_version
    });
    client.basicAuth(authid, authcode);
    return client;
}

program
    .option('-p, --port <port>', 'Port number for user server, if using localhost')
    .option('-h, --host <host>', 'Port number for user server, if using localhost')
    .option('-u, --url <url>', 'Connection URL for user server, if using a remote server');

program
    .command('add <username')
    .description('Add a user to the user server')
    .option('--password <password>', 'Password for new user')
    .option('--email <email>', 'Email adress for new user')
    .action(async(username, cmdObj) => {
        const topost = {
            username,
            password: await hashpass(cmdObj.password),
            emails: []
        };
        if(typeof cmdObj.email !== 'undefined') topost.emails.push(cmdObj.email);
        client(program).post('/create-user', topost, (err, req, res, obj) => {
            if(err) console.error(err.stack);
            else console.log('Created ' + util.inspect(obj));
        });
    });

program
    .command('find <username>')
    .description('Search for a user on the user server')
    .action((username, cmdObj) => {
        client(program).get(`/find/${username}`, (err, req, res, obj) => {
            if(err) console.error(err.stack);
            else console.log('Found ' + util.inspect(obj));
        });
    });

program
    .command('list-users')
    .description('List all users on the user server')
    .action((cmdObj) => {
        client(program).get('/list', (err, req, res, obj) => {
            if(err) console.error(err.stack);
            else console.log(obj);
        });
    });

program
    .command('password-check <username> <password>')
    .description('Check whether the user password checks out')
    .action((username, password, cmdObj) => {
        client(program).post('/password-check', {username, password}, (err, req, res, obj) => {
            if (err) console.error(err.stack);
            else console.log(obj);
        });
    });

program.parse(process.argv);