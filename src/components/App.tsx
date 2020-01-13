import { h, Fragment } from "preact";
import { Header } from './Header';
import { Content } from './Content';
import { Footer } from './Footer';

export function App(props: {header: string, content: string; footer: string}) {
  return (
    <Fragment>
      <Header content={props.header} />
      <Content content={props.content}/>
      <Footer content={props.footer}/>
    </Fragment>
    );
}
