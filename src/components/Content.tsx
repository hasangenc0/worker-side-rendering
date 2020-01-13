import { h, Fragment } from "preact";

export function Content(props: {content: string;}) {
  let rows = [];
  for (let i = 0; i < 5000; i++) {
    rows.push(<div key={i}>{props.content}</div>);
  }
  return (
    <Fragment>
      {rows}
    </Fragment>
    );
}
