import React from "react";
import { Ellipse } from "react-konva";
import { useSelector } from "react-redux";
import canvasTypes from "../../actions/canvas/canvasTypes";

const Guesses = ({ gridSize }) => {
  const xOffset = 1;
  const yOffset = 1;

  const { enemyGuesses, guesses, showing } = useSelector((state) => state.canvas);

  const usingGuesses = showing === canvasTypes.OWN ? enemyGuesses : guesses;

  return usingGuesses.map((guess, index) => (
    <Ellipse
      key={index}
      stroke="black"
      fill={guess.hit ? "red" : "white"}
      width={gridSize / 3}
      height={gridSize / 3}
      x={(guess.x * gridSize + xOffset) + (gridSize / 2)}
      y={(guess.y * gridSize + yOffset) + (gridSize / 2)}
    />
  ));
};

export default Guesses;
