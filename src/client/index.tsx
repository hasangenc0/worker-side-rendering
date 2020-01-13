import { h, render } from "preact";
import { App } from '../components/App';
import { Offline } from './offline';

const container = document.getElementById('root')! as HTMLElement;
render(<App header="Header" footer="footer" content="content"/>, container, container.firstChild as HTMLElement);
(new Offline).init();