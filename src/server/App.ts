import express from 'express';
import path from 'path';

class App {
  public app: express.Application;
  public port: number;

  constructor(appInit: { port: number; middleWares: any; controllers: any; }) {
    this.app = express();
    this.port = appInit.port;

    this.middlewares(appInit.middleWares);
    this.routes(appInit.controllers);
    this.assets();
    this.template();
  }

  private middlewares(middleWares: { forEach: (arg0: (middleWare: any) => void) => void; }) {
    middleWares.forEach(middleWare => {
      this.app.use(middleWare);
    })
  }

  private routes(controllers: { forEach: (arg0: (controller: any) => void) => void; }) {
    controllers.forEach(controller => {
      this.app.use('/', controller.router);
    })
  }

  private assets() {
    this.app.use(express.static(path.join(__dirname, "../public")));
  }

  private template() {
    this.app.set('view engine', 'ejs');
    this.app.set('views', path.join(__dirname, '/views'));
  }

  public listen() {
    this.app.listen(this.port, () => {
      console.log(`App listening on the http://localhost:${this.port}`);
    })
  }
}

export default App;