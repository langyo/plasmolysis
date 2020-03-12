import React from 'react';

export default props => (<p>
  <h1>{"Demo page"}</h1>
  <p>{`Count: ${props.count}`}</p>
  <button onClick={props.increase}>{"+"}</button>
  <button onClick={props.decrease}>{"-"}</button>
</p>);
