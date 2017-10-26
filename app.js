import AFrame from 'aframe'
import * as webvrui from 'webvr-ui'
import 'aframe-animation-component'

import {Entity, Scene} from 'aframe-react'
import React from 'react'
import ReactDOM from 'react-dom'

// Image this use case scenario

// Users open the inspector in the broser showin him just a plane and a sky box
// then they open the haskell console and find that they are in a room and it is asking for a title
// once they put the title a title tag appears in the map just in front of them...
//
// they can create new rooms with the commands, and they will appear in front of them / sides / whatever
// because the backend is creating all of that in the db and passing the new app state to the client
// via sockets
//
// we can explore the idea of givin the users a limited amount of resources that they can use to build
// their island / planet / cloud, whatever and make them pay to get more stuff or more points to decorate the thing
//
// They can also hire NPCs, create new room descirptions, write books, etc... and make all of that available
// read only trough an URL
//
// Micro games, micro worlds, created within the browser, or via console
//
// Get this from haskell, ideally using websockets to be able to show the updates in the map as we create rooms

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

const createCells = (rooms, clickHandler) =>
  rooms.map(r => Cell({
    id: r.name,
    position: {x: r.position[0] * 10, y:0, z: r.position[1] * 10},
    description: r.description,
    clickHandler
  }))

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {color: 'red', cameraPosition: "0 1.6 0"}
  }

  changeColor() {

    const colors = ['red', 'orange', 'yellow', 'green', 'blue']
    this.setState({
      color: colors[Math.floor(Math.random() * colors.length)]
    })
  }

  setCameraPosition = position => {
    console.log(position);
    const oldCameraPosition = this.state.cameraPosition;
    this.setState({
      oldCameraPosition,
      cameraPosition: makePositionString(position)
    })
  }

  // Make the camera a function that handles camera position in a fine grained way
  // We don't want to move the camera with AnimationFrame but use aframe AnimationFrame
  // directives to handle movement

  render () {
    return (
        <Scene inspector="url: https://aframe.io/releases/0.3.0/aframe-inspector.min.js" webvr-ui cursor="rayOrigin: mouse">

          <Entity primitive="a-plane" position="0 -0.5 0" color="#E0586A" rotation="-90 0 0" height="100" width="100"/>
          <Entity primitive="a-light" type="ambient" color="#445451"/>
          <Entity primitive="a-light" type="point" intensity="1" position="0 20 0" color="#ffe500"/>
          <Entity primitive="a-sky" height="2048" radius="30" color="#5BBDBE" theta-length="90" width="2048"/>

          {createCells(rooms, this.setCameraPosition)}

          <Entity id="decoratedMap" position="0 0 0">
            <Entity gltf-model="./resources/models/tree/tree.gltf" position="3 0 10 " />
          </Entity>

          {drawCamera(this.state.oldCameraPosition, this.state.cameraPosition)}

        </Scene>
    )
  }
}

const Box = props =>
  <Entity
    geometry={{primitive: 'box'}}
    material={{color: props.color}}>
  </Entity>

const Room = ({position, id}) =>
  <Entity id={id} position={position}>
    <Entity id="top"     primitive='a-plane' width="10" height="10" color="#0000ff" position="0 5 5"  rotation="90 0 0" side="double" />
    <Entity id="back"    primitive='a-plane' width="10" height="10" color="#00ff00" position="0 0 0"  side="double" />
    <Entity id="front"   primitive='a-plane' width="10" height="10" color="#00ff00" position="0 0 10" side="double" />
    <Entity id="ground"  primitive='a-plane' width="10" height="10" color="#00ff44" position="0 -5 5" rotation="90 0 0" side="double" />
    <Entity id="left"    primitive='a-plane' width="10" height="10" color="#022f11" position="-5 0 5" rotation="0 90 0" side="double" />
    <Entity id="right"   primitive='a-plane' width="10" height="10" color="#30f300" position="5 0 5"  rotation="0 90 0" side="double" />
  </Entity>

const Cell = ({position, id, description, clickHandler}) =>
  <Entity id={id} position={position} key={id}>
    <Entity id="ground"  primitive='a-plane' width="10" height="10" color="#00ff44" position="0 0 0" rotation="90 0 0" side="double" />
    <Entity id="description"  primitive='a-text' value={description} position="0 0 0" rotation="0 0 90 " />
    <Entity id="description"  primitive='a-box' position="0 0 0" events={{click: () => clickHandler(position)}} />
  </Entity>

const createDecoratedMap = () =>
  <Entity id="decoratedMap" position="0 0 0">
    <a-assets>
      <a-asset-item id="tree" src="./resources/models/tree.gltf"></a-asset-item>
    </a-assets>
    <Entity gltf-model="#tree" />
  </Entity>

// we need to make a new camera on every new position to force the animation triggering, that's the key param for
// document.querySelector('#camera').object3D.quaternion
const drawCamera = (oldPosition, newPosition) =>
  <Entity id="camera" camera="userHeight: 1.6" look-controls key={Math.random()*1000}
    animation={{property: 'position', dur: 1000, from: oldPosition, to: newPosition}}>
    <a-cursor fuse="false" color="white"></a-cursor>
  </Entity>

const enterVR = () => document.querySelector('a-scene').enterVR()

// change this to be able to pass a position object instead of making a string
const makePositionString = position => `${position.x} 1.6 ${position.z}` // change 1.6 to player height

ReactDOM.render(<App/>, document.querySelector('#app'))
