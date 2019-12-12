import React, { Component } from 'react';
import ReactDOM, { render } from 'react-dom'
import ThreeScene from './ThreeScene'

class App extends Component {


    render() {

        return (
            <div className="container">
                <ThreeScene width="1000"/>
            </div>
        );
    }
}

render(<App />, document.getElementById('root'))