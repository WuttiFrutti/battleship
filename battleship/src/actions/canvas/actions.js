import canvasTypes from './canvasTypes';
import messageTypes from 'shared/messageTypes';


export const moveShip = (x, y, ship) => {
    return { type: messageTypes.MOVE_SHIP, payload: { x: x, y: y, ship: ship } }
}

export const rotateShip = (rotation, ship) => {
    return { type: messageTypes.ROTATE_SHIP, payload: { rotation: rotation, ship: ship } }
}
export const switchVision = () => {
    return { type: canvasTypes.SWITCH_VISION }
}

export const selectBlock = (block) => {
    return { type: messageTypes.SELECT_BLOCK, payload: { block } }
}

export const changeGridSize = (gridSize) => {
    return { type: canvasTypes.CHANGE_GRIDSIZE, payload: { gridSize}}
}