import React from "react";
import { Stage, Layer, Image } from "react-konva";
import { Provider, useSelector } from "react-redux";
import Grid from "./Grid/Grid";
import Ship from "./Ship/Ship";
import gameStates from "shared/gameStates";
import canvasTypes from "../actions/canvas/canvasTypes";
import store from "../config/store";
import grid, { createGrid } from "../shared/createGrid";
import Guesses from "./Guesses/Guesses";
import useImage from "use-image";
import { gridLength } from "shared/gridConflicts";

const Canvas = () => {
  const { ships, state, ready, showing, gridSize } = useSelector((state) => state.canvas);
  const moveable = state === gameStates.PLACING_SHIPS && !ready;
  const [background] = useImage(`/assets/images/bk_water.jpg`);

  if (!grid.length) {
    createGrid(gridLength);
  }

  return (
    <Stage width={(gridSize * gridLength) + 2} height={(gridSize * gridLength) + 2}>
      <Provider store={store}>
        <Layer>
          <Image image={background} x={1} y={1} width={gridSize * gridLength} height={gridSize * gridLength}></Image>
        </Layer>
        <Layer>
          <Grid moveable={moveable} grid={grid}></Grid>
        </Layer>
        <Layer>
          {showing === canvasTypes.OWN &&
            Object.entries(ships).map((ship) => (
              <Ship
                moveable={moveable}
                key={ship[0]}
                ship={ship[0]}
                gridSize={gridSize}
                xPos={ship[1].x}
                yPos={ship[1].y}
                length={ship[1].length}
                rotation={ship[1].rotation}
                hasOffset={ship[1].hasOffset || false}
              ></Ship>
            ))}
          <Guesses gridSize={gridSize} />
        </Layer>
      </Provider>
    </Stage>
  );
};

export default Canvas;
