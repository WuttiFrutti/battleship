import { combineReducers } from "@reduxjs/toolkit";
import reducer from "./reducer";


export const allReducers = combineReducers({
	canvas: reducer,
});
