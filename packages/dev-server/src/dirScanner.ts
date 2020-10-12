import * as realFs from 'fs';
import { join } from 'path';

export interface INode {
  [key: string]: string | INode
};

export const scan = (path: string): INode => {
  let nodes: INode = {};
  for (const fileName of realFs.readdirSync(path)) {
    if (realFs.statSync(join(path, fileName)).isDirectory()) {
      nodes[fileName.substr(fileName.lastIndexOf('.'))] =
        scan(join(path, fileName));
    }
    else if (/(\.js)|(\.mjs)|(\.ts)|(\.jsx)|(\.tsx)$/.test(fileName)) {
      nodes[fileName.substr(fileName.lastIndexOf('.'))] =
        join(path, fileName);
    }
  }
  return nodes;
}