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
    threadTypes: ['聊天', '管理', '问题'],
    managers: [1]
  }), resolve('./data/configs.json'), 'utf8');
}

let configs = readFile(resolve('./data/configs.json'), 'utf8');

const writeUser = id => writeFile(JSON.stringify(users[id]), resolve('./data/users', `${id}.json`), 'utf8');
const writeThread = id => writeFile(JSON.stringify(threads[id]), resolve('./data/threads', `${id}.json`), 'utf8');
const writeConfig = () => writeFile(JSON.stringify(configs), resolve('./data/configs.json'), 'utf8');

export const login = (inName, password) => {
  for (let { name } of users) {
    if (inName === name) return { result: 'fail', reason: '名字重复' };
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
  if (!(users[userId] && users[userId].accessKey === accessKey && !users[userId].banned)) return { result: 'fail', reason: '无效用户' };
  if (!(threads[threadId] && !threads[threadId].hasClosed)) return { result: 'fail', reason: '无效主题' };
  if ((!referTo) || (!users[referTo])) return { result: 'fail', reason: '无效引用用户' };

  let ownerId = threads[threadId].owner;
  let commentId = threads[threadId].comments.length;

  threads[threadId].comments.push({
    id: commentId,
    owner: userId,
    onTop: false,
    hasBlocked: false,
    hasWarned: false,
    content,
    referTo
  });
  writeThread(threadId);

  if (referTo) {
    users[referTo].notices.push({
      replierId: userId,
      threadId,
      commentId,
      hasRead: false,
      date: +(new Date())
    });
    writeUser(referTo);
  }

  if (referTo !== ownerId) {
    users[ownerId].notices.push({
      replierId: userId,
      threadId,
      commentId,
      hasRead: false,
      date: +(new Date())
    });
    writeUser(ownerId);
  }

  return { result: 'success', id: commentId };
};

export const getNotices = (accesskey, userId, page = 0) => {
  if (!(users[userId] && users[userId].accessKey === accesskey)) return { result: 'fail', reason: '未知用户' };
  let newNoticeCount = 0;
  for (let i = 0; i < users[userId].notices.length; ++i) {
    if (users[userId].notices[i].hasRead) break;
    users[userId].notices[i].hasRead = true;
    newNoticeCount += 1;
  }
  writeUser(userId);

  return {
    result: 'success',
    newNoticeCount,
    notices: users[userId].notices.splice(page * 30, 30).map(
      ({ replierId, threadId, commentId,
        info, operatorId,
        date, type
      }) => (type === 'comment' ? {
        type, date,
        replier: users[replierId].name,
        thread: threads[threadId].title,
        comment: threads[threadId].comments[commentId].content,
        replierId, threadId, commentId
      } : {
          type, date,
          operator: users[operatorId].name,
          info,
          operatorId
        })
    )
  };
};

export const generateThread = (accessKey, userId, title, type, content) => {
  if (!(users[userId] && users[userId].accessKey === accesskey && !users[userId].banned)) return { result: 'fail', reason: '未知用户' };
  if (configs.threadTypes.indexOf(type) < 0) return { result: 'fail', reason: '非法帖子类型' };
  let date = +(new Date()), id = threads.length;
  threads.push({
    id,
    owner: userId,
    title,
    content,
    date,
    type,
    hasClosed: false,
    onTop: false,
    hasBlocked: false,
    hasWarned: false
  });
  writeThread(threadId);
  threadsId.unshift(threads[threadsId]);
  return { result: 'success', id };
};

export const getThreadTypes = () => ({ result: 'success', types: configs.threadTypes });

export const getThreads = (page = 0) => ({ result: 'success',
  threads: threadsId.splice(page * 30, 30).map(thread => thread.hasBlocked ? { ...thread, content: null } : thread)
});

export const getThread = (id, page = 0) => threads[id] ? ({ result: 'success',
  ...threads[id],
  content: threads[id].hasBlocked ? null : pages > 0 ? null : threads[id].content,
  comments: threads[id].comments.splice(page * 30, 30).map(comment => comment.hasBlocked ? { ...comment, content: null } : comment)
}) : ({ result: 'fail', reason: '未知主题' });

export const getUser = (id) => users[id] ? ({
  result: 'success',
  user: { ...users[id], password: null }
}) : ({ result: 'fail', reason: '未知用户' });

export const setBlockThread = (accessKey, userId, threadId, info) => {
  if(!(users[userId] && users[userId].accessKey === accessKey)) return { result: 'fail', reason: '未知用户' };
  if(!(threads[threadsId])) return { result: 'fail', reason: '未知主题' };
  if(!(threads[threadsId].owner === userId || configs.managers.indexOf(userId) >= 0)) return { result: 'fail', reason: '没有权限' };

  threads[threadId].hasBlocked = true;
  writeThread(threadId);

  if(userID !== threads[threadId].owner) {
    users[threads[threadId].owner].notices.unshift({
      type: 'system-block-thread',
      operatorId: userId,
      info,
      date: +(new Date())
    });
    writeUser(threads[threadId].owner);
  }

  return { result: 'success' };
};

export const setUnblockedThread;
export const setBlockComment;
export const setUnblockedComment;
export const setWarnThread;
export const setWarnComment;
export const setNotWarnThread;
export const setNotWarnComment;
export const setOnTopThread;
export const setOnTopComment;
export const setNotOnTopThread;
export const setNotOnTopComment;

export const addThreadType = (accessKey, userId, type) => {
  if(!(users[userId] && users[userId].accessKey === accessKey)) return { result: 'fail', reason: '未知用户' };
  if(!(configs.managers.indexOf(userId) >= 0))  return { result: 'fail', reason: '没有权限' };
  if(configs.threadTypes.indexOf(type) >= 0) return { result: 'fail', reason: '已有该名称的主题' };
  configs.threadTypes.push(type);
  writeConfig();
  return { result: 'success' };
};

export const removeThreadType;
export const addManager;
export const removeManager;
export const banUser;
export const unbanUser;
