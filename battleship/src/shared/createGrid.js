let grid = [];

export const createGrid = (amount = 10) => {
    for (let i = 0; i < amount; i++) {
      for (let ii = 0; ii < amount; ii++) {
        grid.push({x: ii, y: i });
      }
    };
  };



export default grid;