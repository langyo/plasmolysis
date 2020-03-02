import { resolve } from 'path';
export default resolve(process.env.DEMO ? `${process.cwd()}/demo/${process.env.DEMO}` : `${process.cwd()}`);
