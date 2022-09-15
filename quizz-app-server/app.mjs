import { default as express } from 'express';
import * as path from 'path';
import { default as logger } from 'morgan';
import { default as cookieParser } from 'cookie-parser';
import { default as bodyParser } from 'body-parser';
import * as http from 'http';
import { approotdir } from './approotdir.mjs';
const __dirname = approotdir;
import {
  normalizePort, onError, onListening, handle404, basicErrorHandler
} from './appsupport.mjs';
import session from 'express-session';
import sessionFileStore from 'session-file-store';
const FileStore = sessionFileStore(session);
export const sessionCookieName = 'notescookie.sid';
import sessionMemoryStore from 'memorystore';
const MemoryStore = sessionMemoryStore(session);
import { router as userRouter, initPassport} from './routes/users.mjs';
import { default as DBG } from 'debug';
const debug = DBG('server:debug');
const dbgerror = DBG('server:error');
import { default as cors} from 'cors';
export const app = express();

const corsConfig = {
    credentials: true,
    origin: true,
};
app.use(cors(corsConfig));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  store: new MemoryStore({}),
  secret: 'keyboard mouse',
  resave: false,
  saveUninitialized: true,
  name: sessionCookieName
 }));
initPassport(app);

app.use('/users', userRouter);

app.use(handle404);
app.use(basicErrorHandler);
export const port = normalizePort(process.env.PORT || '8080');
app.set('port', port);

export const server = http.createServer(app);
server.listen(port);
server.on('error', onError);
server.on('listening', onListening);