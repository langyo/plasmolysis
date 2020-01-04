import {
  statSync as stat,
  existsSync as exist,
  readdirSync as readDir,
  readFileSync as readFile,
  writeFileSync as writeFile,
  mkdirSync as mkdir
} from 'fs';
import { resolve } from 'path';
import shortid from 'shortid';

if (!exist(resolve('./data'))) mkdir('./data');
if (!exist(require('./data/users'))) mkdir('./data/users');
if (!exist(require('./data/threads'))) mkdir('./data/threads');

let users = Array.prototype.slice.call(
  readDir(resolve('./data/users'))
    .filter(name => /\.json$/.test(name))
    .map(name => readFile(resolve('./data/users', name), 'utf8'))
    .map(body => JSON.parse(body))
    .filter(obj => typeof obj.id === 'number' && typeof obj.name === 'string')
    .reduce((obj, user) => ({
      ...obj,
      [user.id]: user
    }), {})
);

let threads = Array.prototype.slice.call(
  readDir(resolve('./data/threads'))
    .filter(name => /\.json$/.test(name))
    .map(name => readFile(resolve('./data/threads', name), 'utf8'))
    .map(body => JSON.parse(body)).filter(obj => typeof obj.id === 'number' && typeof obj.owner === 'number').reduce((obj, thread) => ({
      ...obj,
      [thread.id]: thread
    }), {})
);

let threadsId = [];
const sortThreads = () => threadsId = [...threads].sort((a, b) => a.onTop || !b.onTop || a.date > b.date);

if (!exist(resolve('./data/configs.json'))) {
  if (!exist(resolve('./data/users/1.json'))) {
    users[1] = {
      id: 1,
      name: 'admin',
      password: 'admin',
      // 不再需要 manager 这个项，因为 config.json 下有了
      banned: false,
      replys: [],
      notices: []
    };
    writeFile(JSON.stringify(users[1]), resolve('./data/users/1.json'), 'utf8');
  }
  writeFile(JSON.stringify({
    websiteName: 'I Forum',
    threadTypes: ['Chatting', 'Management', 'Question'],
    managers: [1]
  }), resolve('./data/configs.json'), 'utf8');
}

let configs = readFile(resolve('./data/configs.json'), 'utf8');

const writeUser = id => writeFile(JSON.stringify(users[id]), resolve('./data/users', `${id}.json`), 'utf8');
const writeThread = id => writeFile(JSON.stringify(threads[id]), resolve('./data/threads', `${id}.json`), 'utf8');
const writeConfig = () => writeFile(JSON.stringify(configs), resolve('./data/configs.json'), 'utf8');

export const login = (inName, password) => {
  for (let { name } of users) {
    if (inName === name) return { result: 'fail', reason: 'The name has been used.' };
  }
  let id = users.length;
  users.push({
    id,
    name: inName,
    password,
    banned: false,
    accessKey: shortid.generate()
  });
  writeUser(id);
  return { result: 'true', accessKey: users[id].accessKey };
};

export const reply = (accessKey, userId, threadId, content, referTo) => {
  if(!(users[userId] && users[userId].accessKey === accessKey && !users[userId].banned)) return { result: 'fail', reason: 'Error user token.' };
  if(!(threads[threadId] && !threads[threadId].hasClosed)) return { result: 'fail', reason: 'Error thread.' };
  if((!referTo) || (!users[referTo])) return { result: 'fail', reason: 'Unknown reference.' };
  // 待录入，页码 3
};