const gridLength = 7

const hasConflict = (xCor, yCor, rotation, ships, ship = "NONE", length = 1) =>
    xCor > gridLength - 1 ||
    (xCor > gridLength - length && rotation === 90) ||
    xCor < 0 ||
    yCor < 0 ||
    yCor > gridLength - 1 ||
    (rotation === 0 && yCor > gridLength - length) ||
    ships.find((skippy) => {
        const tempShip = skippy[1];
        if (ship === skippy[0]) return false;
        if (rotation === 90 && tempShip.rotation === 0)
            return loopCors(tempShip, length, (i, ii) => xCor + i === tempShip.x && yCor === tempShip.y + ii);
        if (rotation === 90 && tempShip.rotation === 90)
            return loopCors(tempShip, length, (i, ii) => xCor + i === tempShip.x + ii && yCor === tempShip.y);
        if (rotation === 0 && tempShip.rotation === 90)
            return loopCors(tempShip, length, (i, ii) => yCor + i === tempShip.y && xCor === tempShip.x + ii);
        if (rotation === 0 && tempShip.rotation === 0)
            return loopCors(tempShip, length, (i, ii) => yCor + i === tempShip.y + ii && xCor === tempShip.x);
        return false;
    });

const loopCors = (ship, length, check) => {
    for (let i = 0; i < length; i++) {
        for (let ii = 0; ii < ship.length; ii++) {
            if (check(i, ii)) return ship;
        }
    }
    return false;
};

module.exports.loopCors = loopCors;
module.exports = hasConflict;
module.exports.gridLength = gridLength;