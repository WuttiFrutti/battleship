import { composeWithDevTools } from 'redux-devtools-extension'
import { applyMiddleware, createStore } from 'redux'
import { allReducers } from '../reducers';
import thunk from "redux-thunk";

const configureStore = (preloadedState) => {
	const middlewares = [thunk]
	const middlewareEnhancer = applyMiddleware(...middlewares)
  
	const enhancers = [middlewareEnhancer]
	const composedEnhancers = composeWithDevTools(...enhancers)
  
	const store = createStore(allReducers, preloadedState, composedEnhancers)
  
	return store
  }

export default configureStore();

