import 'aframe';

import {Entity, Scene} from 'aframe-react';
import React from 'react';
import ReactDOM from 'react-dom';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {color: 'red'};
  }

  changeColor() {
    const colors = ['red', 'orange', 'yellow', 'green', 'blue'];
    this.setState({
      color: colors[Math.floor(Math.random() * colors.length)]
    });
  }

  render () {
    return (
      <Scene inspector="url: https://aframe.io/releases/0.3.0/aframe-inspector.min.js">
        <Entity primitive="a-plane" position="0 -0.5 0" color="#E0586A" rotation="-90 0 0" height="100" width="100"/>
        <Entity primitive="a-light" type="ambient" color="#445451"/>
        <Entity primitive="a-light" type="point" intensity="2" position="2 4 4"/>
        <Entity primitive="a-sky" height="2048" radius="30" color="#5BBDBE" theta-length="90" width="2048"/>

        <Entity id="box"
          geometry={{primitive: 'box'}}
          material={{color: '#6A616B'}}
          position={{x: 0, y: 0, z: -3}}>
        </Entity>

        <Box color='#300' />

        <Room position={{x: 0, y: 5, z: -5}} />
        <Room position={{x: 0, y: 5, z: -15}} />

      </Scene>
    );
  }
}

const Box = props =>
  <Entity
    geometry={{primitive: 'box'}}
    material={{color: props.color}}
    position={{x: 0, y: 0, z: 0}}>
  </Entity>

const Room = props =>
  <Entity position={props.position}>
    <Entity id="top"     primitive='a-plane' width="10" height="10" color="#0000ff" position="0 5 5"  rotation="90 0 0" side="double" />
    <Entity id="back"    primitive='a-plane' width="10" height="10" color="#00ff00" position="0 0 0"  side="double" />
    <Entity id="front"   primitive='a-plane' width="10" height="10" color="#00ff00" position="0 0 10" side="double" />
    <Entity id="ground"  primitive='a-plane' width="10" height="10" color="#00ff44" position="0 -5 5" rotation="90 0 0" side="double" />
    <Entity id="left"    primitive='a-plane' width="10" height="10" color="#022f11" position="-5 0 5" rotation="0 90 0" side="double" />
    <Entity id="right"   primitive='a-plane' width="10" height="10" color="#30f300" position="5 0 5"  rotation="0 90 0" side="double" />
  </Entity>

// const Room = props =>

ReactDOM.render(<App/>, document.querySelector('#app'));
