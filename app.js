import AFrame from 'aframe';
import * as webvrui from 'webvr-ui';

import {Entity, Scene} from 'aframe-react';
import React from 'react';
import ReactDOM from 'react-dom';



AFrame.registerComponent('fps-look-controls', require('aframe-fps-look-component').component);

const rooms = [
  {
    name: 'room1',
    position: [0,0],
    description: 'this is room 1'
  },
  {
    name: 'room2',
    position: [0,1],
    description: 'this is room at north'
  },
  {
    name: 'room3',
    position: [0,-1],
    description: 'this is room at south'
  },
  {
    name: 'room4',
    position: [-1,0],
    description: 'this is room at west'
  },
  {
    name: 'room5',
    position: [1,0],
    description: 'this is room at east'
  },
]

const createCells = rooms =>
  rooms.map(r => Cell({
    id: r.name,
    position: {x: r.position[0] * 10, y:0, z: r.position[1] * 10},
    description: r.description
  }))


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
        <Scene inspector="url: https://aframe.io/releases/0.3.0/aframe-inspector.min.js" webvr-ui>

          <Entity primitive="a-plane" position="0 -0.5 0" color="#E0586A" rotation="-90 0 0" height="100" width="100"/>
          <Entity primitive="a-light" type="ambient" color="#445451"/>
          <Entity primitive="a-light" type="point" intensity="1" position="0 20 0" color="#ffe500"/>
          <Entity primitive="a-sky" height="2048" radius="30" color="#5BBDBE" theta-length="90" width="2048"/>

          {createCells(rooms)}

          <Entity id="decoratedMap" position="0 0 0">
            <Entity gltf-model="./resources/models/tree/tree.gltf" position="3 0 10 " />
          </Entity>

          <Entity camera="userHeight: 1.6" active="true" wasd-controls look-controls />

        </Scene>
    );
  }
}

// <Box color='#300' />
//
// const Box = props =>
//   <Entity
//     geometry={{primitive: 'box'}}
//     material={{color: props.color}}
//     position={{x: 0, y: 0, z: 0}}>
//   </Entity>

const Room = ({position, id}) =>
  <Entity id={id} position={position}>
    <Entity id="top"     primitive='a-plane' width="10" height="10" color="#0000ff" position="0 5 5"  rotation="90 0 0" side="double" />
    <Entity id="back"    primitive='a-plane' width="10" height="10" color="#00ff00" position="0 0 0"  side="double" />
    <Entity id="front"   primitive='a-plane' width="10" height="10" color="#00ff00" position="0 0 10" side="double" />
    <Entity id="ground"  primitive='a-plane' width="10" height="10" color="#00ff44" position="0 -5 5" rotation="90 0 0" side="double" />
    <Entity id="left"    primitive='a-plane' width="10" height="10" color="#022f11" position="-5 0 5" rotation="0 90 0" side="double" />
    <Entity id="right"   primitive='a-plane' width="10" height="10" color="#30f300" position="5 0 5"  rotation="0 90 0" side="double" />
  </Entity>

const Cell = ({position, id, description}) =>
  <Entity id={id} position={position} key={id}>
    <Entity id="ground"  primitive='a-plane' width="10" height="10" color="#00ff44" position="0 0 0" rotation="90 0 0" side="double" />
    <Entity id="description"  primitive='a-text' value={description} position="0 0 0" rotation="0 0 90 " />
  </Entity>

const createDecoratedMap = () =>
  <Entity id="decoratedMap" position="0 0 0">
    <a-assets>
      <a-asset-item id="tree" src="./resources/models/tree.gltf"></a-asset-item>
    </a-assets>
    <Entity gltf-model="#tree" />
  </Entity>

const enterVR = () => document.querySelector('a-scene').enterVR()

// const Room = props =>

ReactDOM.render(<App/>, document.querySelector('#app'));
