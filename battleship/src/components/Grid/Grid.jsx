import React, { useState, useEffect } from "react";
import { Rect } from "react-konva";
import { useSelector } from "react-redux";
import { selectBlock } from "../../actions/canvas/actions";
import canvasTypes from "../../actions/canvas/canvasTypes";
import WebSocketClient from "../../shared/websocket";


const Grid = ({ grid, moveable }) => {
  const { showing, inTurn, gridSize } = useSelector((state) => state.canvas);
  const selectable = !moveable && showing === canvasTypes.OTHER && inTurn;

  return grid.map((rect, index) => (
    <GridRect
      selectable={selectable}
      key={index}
      stroke="black"
      width={gridSize}
      height={gridSize}
      x={1 + (rect.x * gridSize)}
      y={1 + (rect.y * gridSize)}
      originalX={rect.x}
      originalY={rect.y}
    />
  ));
};

const GridRect = ({ selectable, ...props }) => {
  const { selectedBlock } = useSelector((state) => state.canvas);
  const [fill, setFill] = useState("white");
  const [selected, setSelected] = useState();


  useEffect(() => {
    let selected = selectedBlock && props.originalX === selectedBlock.x && props.originalY === selectedBlock.y && selectable;
    setSelected(selected);
    if (selected) {
      setFill("#3f51b598");
    } else {
      setFill();
    }
  }, [selectedBlock, selectable, props.originalX, props.originalY]);

  const sendBlock = () => {
    WebSocketClient.sendMessage(selectBlock({ x: props.originalX, y: props.originalY }));
  };

  const onMouseEnter = () => {
    if (selected) {
      setFill("#3f51b5c7");
    } else {
      setFill("#8b8b8ba0");
    }
  };
  const onMouseLeave = () => {
    if (selected) {
      setFill("#3f51b5c7");
    } else {
      setFill();
    }
  };

  return (
    <Rect
      onClick={() => !selected && selectable && sendBlock()}
      onTap={() => !selected && selectable && sendBlock()}
      onMouseEnter={!selected && selectable ? onMouseEnter : null}
      onMouseLeave={!selected && selectable ? onMouseLeave : null}
      fill={fill}
      {...props}
    ></Rect>
  );
};

export default Grid;
