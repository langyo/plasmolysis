import bodyParser from 'body-parser';

export default server => server.use(bodyParser.json());