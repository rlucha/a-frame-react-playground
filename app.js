import AFrame from 'aframe'
import * as webvrui from 'webvr-ui'
import 'aframe-animation-component'

import {Entity, Scene} from 'aframe-react'
import React from 'react'
import ReactDOM from 'react-dom'

import _debounce from 'lodash.debounce'

// TODO create a repo and move this code to it, map the Haskell bakend to JSON per area, get it from this client...
// Draw rooms from that json. Manually create the decorated map on top of that.
// Connect both with web sockets


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

// Allow navigation with N, S, W, E keys... show compass on HUD

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
    this.state = {
      color: 'red',
      cameraPosition: "0 1.6 0",
      mode: 'editor'
    }
  }

  changeColor() {

    const colors = ['red', 'orange', 'yellow', 'green', 'blue']
    this.setState({
      color: colors[Math.floor(Math.random() * colors.length)]
    })
  }

  // we have to debounce this event handler or it will
  // fire multiple times on multiclick making the animation be instantaneous
  _setCameraPosition = _debounce(position => {
    const oldCameraPosition = this.state.cameraPosition;
    this.setState({
      oldCameraPosition,
      cameraPosition: makePositionString(position)
    })
  }, 100)

  setCameraPosition = position => this._setCameraPosition(position)

  drawCamera = () => {
    if (this.state.mode === 'editor') {
      return (<EditorCamera />)
    } else {
      return (<PlayerCamera oldPosition={this.state.oldCameraPosition} newPosition={this.state.cameraPosition} />)
    }
  }

  // to debug set cursor="rayOrigin: mouse" on scene
  render () {
    return (
      <div className="nm-game">
        <div className="ng-game__terminal">
          Welcome to the adventure
        </div>
        <div className="nm-game__scene">
          <Scene inspector="url: https://aframe.io/releases/0.3.0/aframe-inspector.min.js" webvr-ui >

            <Entity primitive="a-plane" position="0 -0.5 0" color="#E0586A" rotation="-90 0 0" height="100" width="100"/>
            <Entity primitive="a-light" type="ambient" color="#445451"/>
            <Entity primitive="a-light" type="point" intensity="1" position="0 20 0" color="#ffe500"/>
            <Entity primitive="a-sky" height="2048" radius="30" color="#5BBDBE" theta-length="90" width="2048"/>

            {createCells(rooms, this.setCameraPosition)}

            <Entity id="decoratedMap" position="0 0 0">
              <Entity gltf-model="./resources/models/tree/tree.gltf" position="3 0 10 " />
            </Entity>

            {this.drawCamera()}

          </Scene>
        </div>
      </div>
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
    <Entity id="ground"  primitive='a-plane' width="10" height="10" color="#cc3344" position="0 0 0" rotation="90 0 0" side="double" />
    <Entity id="description"  primitive='a-text' value={description} position="0 0 0" rotation="0 0 90 " />
    <Entity id="description"  primitive='a-box' position="0 0 0" events={{click: () => clickHandler(position)}} />
  </Entity>

const createDecoratedMap = () =>
 // use magicaVoxel?
  <Entity id="decoratedMap" position="0 0 0">
    <a-assets>
      <a-asset-item id="tree" src="./resources/models/tree.gltf"></a-asset-item>
    </a-assets>
    <Entity gltf-model="#tree" />
  </Entity>


// TODO move oldPosition to camera state instead of setting it on the app state
class PlayerCamera extends React.Component {
  componentDidUpdate() {
    setTimeout(() => document.querySelector('#camera').emit('animationRun'), 200)
  }

  render() {
    return(<Entity id="camera" camera="userHeight: 1.6" look-controls
      animation={{property: 'position', dur: 1000, from: this.props.oldPosition, to: this.props.newPosition, restartEvents: ['animationRun']}}>
      <a-cursor fuse="false" color="white"></a-cursor>
    </Entity>)
  }
}

// Race condition between DOM & Three.js mounting, using timeout 0 to flush it to the end of the event queue
const setIsometric = ref => {
  setTimeout(() => {
    const camera = ref.el.object3DMap.camera;
    console.log(ref.el.object3DMap);
    camera.rotation.order = 'YXZ';
    camera.rotation.y = - Math.PI / 4;
    camera.rotation.x = Math.atan( - 1 / Math.sqrt( 2 ) );
    camera.position.set(-40,50,40)
  } , 0)
}

const EditorCamera = () =>
  // new THREE.OrthographicCamera()
  // $0.object3DMap.camera
  // a.rotation.order = 'YXZ';
  // a.rotation.y = - Math.PI / 4;
  // a.rotation.x = Math.atan( - 1 / Math.sqrt( 2 ) );
  // a.position.set(-40,50,40)

  <Entity camera ref={setIsometric}/>

const enterVR = () => document.querySelector('a-scene').enterVR()

// change this to be able to pass a position object instead of making a string
const makePositionString = position => `${position.x} 1.6 ${position.z}` // change 1.6 to player height


document.body.addEventListener('onkeydown', e => console.log(e.key))

ReactDOM.render(<App/>, document.querySelector('#app'))
