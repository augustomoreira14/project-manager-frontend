// import logo from './logo.svg';
// import './App.css';
import React from 'react'
import { Container, Navbar } from 'react-bootstrap'

import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";

import Projects from './pages/Projects';
import Activities from './pages/Activities';

function App () {
  return (
    <Router>
      <Navbar bg="primary" variant="dark">
        <Navbar.Brand href="#home">Project Manager</Navbar.Brand>
        <Navbar.Collapse className="justify-content-end">
        </Navbar.Collapse>
      </Navbar>
      <Container className="mt-3">
        <Switch>
          <Route exact path="/" component={Projects} />
          <Route path="/projects/:id" component={Activities} />
        </Switch>
      </Container>        
    </Router>
  );
}

export default App;
