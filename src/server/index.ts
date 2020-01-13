//import * as bodyParser from 'body-parser';
import App from './app';
import Controller from './Controller';

const app = new App({
  port: 1881,
  controllers: [
    new Controller(),
  ],
  middleWares: [
  ]
});

app.listen();