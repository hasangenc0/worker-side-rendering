import * as express from 'express';
import render from 'preact-render-to-string';
import { h } from "preact";
import { App } from '../components/App';
import { campaigns } from './data/campaigns';

class Controller {
    public path = '/';
    public router = express.Router();

    constructor() {
        this.initRoutes();
    }

    public initRoutes() {
        this.router.get('/', this.index);
        this.router.get('/template', this.template);
        this.router.get('/trendyol', this.tyRegular);
        this.router.get('/trendyol/partials/:partial', this.tyGetPartials);
    }

    index = (req: express.Request, res: express.Response) => {
        const data = {header:"Header", footer:"footer", content:"content"};

        if (req.query.contentOnly) {
            res.json(data);
        } else {
            let html = render(
                <App {...data}/>
            );

            res.render('home', { html });
        }
    }

    template = (req: express.Request, res: express.Response) => {
        res.render('template');
    }

    tyRegular = (req: express.Request, res: express.Response) => {
        if (req.query.contentOnly) {
            res.json(campaigns);
        } else {
            res.render('trendyol', { campaigns });
        }
    }

    tyGetPartials = (req: express.Request, res: express.Response) => {
        res.render(`trendyol/${req.params.partial}`);
    }

}

export default Controller;