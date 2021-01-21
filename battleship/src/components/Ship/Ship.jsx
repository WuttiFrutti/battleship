import React from "react";
import { Rect, Image, Group } from "react-konva";
import { moveShip, rotateShip } from "./../../actions/canvas/actions";
import useImage from "use-image";
import hasConflict from "shared/gridConflicts";
import WebSocketClient from "../../shared/websocket";
import { useDispatch, useSelector } from 'react-redux';

const Ship = ({ xPos, yPos, length = 2, rotation = 0, gridSize, ship, moveable, hasOffset }) => {
  const dispatch = useDispatch()
  const { ships } = useSelector(state => state.canvas)

  const [rotateIcon] = useImage("/assets/images/rotate-2-xxl.png");
  const [shipImage] = useImage(`/assets/images/${ship.replace(/\s|[0-9]/g, '')}.png`);

  const xOffset = 1;
  const yOffset = 2;


  let x = (x) => x * gridSize + (!hasOffset || rotation ? gridSize / 4 + xOffset : 0);
  let y = (y) => y * gridSize + (!hasOffset || !rotation ? gridSize / 4 + yOffset : 0);

  const snapToGrid = (e) => {
    let xCor = Math.floor(e.target.x() / gridSize);
    let yCor = Math.floor(e.target.y() / gridSize);

    if (hasConflict(xCor, yCor, rotation, Object.entries(ships), ship, length)) {
      e.target.setY(y(ships[ship].y));
      e.target.setX(x(ships[ship].x));
      return;
    }

    e.target.setY(y(yCor));
    e.target.setX(x(xCor));
    dispatch(moveShip(xCor, yCor, ship));
    WebSocketClient.sendMessage(moveShip(xCor, yCor, ship));
  };

  const rotate = () => {
    const newRotation = !rotation ? 90 : 0;
    if (hasConflict(xPos, yPos, newRotation, Object.entries(ships), ship, length)) return;
    dispatch(rotateShip(!rotation ? 90 : 0, ship));
    WebSocketClient.sendMessage(rotateShip(!rotation ? 90 : 0, ship));
  };

  let width = hasOffset ? gridSize : gridSize / 2;
  let height = hasOffset ? gridSize : gridSize / 2;

  if (rotation === 0) height = (gridSize / 2) * ((length - 0.5) * 2);
  if (rotation === 90) width = (gridSize / 2) * ((length - 0.5) * 2);

  return (
    <Group x={x(xPos)} y={y(yPos)} onDragEnd={snapToGrid} draggable={moveable}>
      {shipImage ? (
        <Image
          rotation={rotation ? rotation + 180 : rotation}
          y={rotation ? (!hasOffset ? gridSize / 2 : gridSize) : 0}
          image={shipImage}
          height={rotation ? width : height}
          width={rotation ? height : width}
        />
      ) : (
        <Rect fill="black" stroke="white" width={width} height={height}></Rect>
      )}
      {moveable ? <Image onTap={rotate} onClick={rotate} image={rotateIcon} width={gridSize / 2} height={gridSize / 2} x={2} y={2} /> : null}
    </Group>
  );
};

export default Ship;
