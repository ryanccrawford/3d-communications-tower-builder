import React, { Component } from 'react';
import ReactDOM, { render } from 'react-dom'
import ThreeScene from './ThreeScene'

class App extends Component {

    constructor(props) {
        super(props) 
    }

    render() {

        return (
            <div className="container">
                <ThreeScene width="1000" height="800" alpha={true} />
            </div>
        );
    }
}

render(<App />, document.getElementById('root'))