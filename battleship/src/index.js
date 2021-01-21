import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import store from './config/store';
import { BrowserRouter as Router } from "react-router-dom";
import "./index.css"
import { Provider } from 'react-redux';
import Routes from "./config/routes.js";
import "./scss/main.scss"
import { useRef } from 'react';


const mainMargin = 64;


const Main = (props) => {
  const [width, setWidth] = useState()
  const [height, setHeight] = useState()
  const main = useRef();

  

  useEffect(() => {
    const handleResize = () => {
      setHeight(window.innerHeight - mainMargin)
      setWidth(window.innerWidth - mainMargin)
    }
    window.addEventListener('resize', handleResize)
    setHeight(window.innerHeight - mainMargin)
    setWidth(window.innerWidth - mainMargin)
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [main])

  return (
    <main ref={main}>
      <Router>
        <Routes width={width} height={height} />
      </Router>
    </main>
  )
}

ReactDOM.render(
    <Provider store={store}>
      <Main />
    </Provider>,
  document.getElementById('root')
);

