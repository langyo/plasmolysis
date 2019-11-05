import express from 'express';
import path from 'path';

export default server => server.use(
  '/static',
  express.static(path.join(__dirname, '../public'), {
    maxAge: '1d',
    immutable: true
  })
);