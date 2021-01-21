import { Box, Typography, Grid, List, ListItem, ListItemText } from "@material-ui/core";
import { useSelector } from "react-redux";


const ShipLists = () => {
  const { enemyShipsSunk, ships } = useSelector((state) => state.canvas);


  return (
    <Box mt={3}>
      <Grid item>
        <Typography variant="h6">Enemy ships sunk:</Typography>
        <div>
          <List>
            {enemyShipsSunk.map((ship) => (
              <ListItem key={ship}>
                <ListItemText primary={ship} />
              </ListItem>
            ))}
          </List>
        </div>
      </Grid>
      <Grid item>
        <Typography variant="h6">Own ships sunk:</Typography>
        <div>
          <List>
            {Object.values(ships)
              .filter((ship) => ship.sunk)
              .map((ship) => (
                <ListItem key={ship.name}>
                  <ListItemText primary={ship.name} />
                </ListItem>
              ))}
          </List>
        </div>
      </Grid>
    </Box>
  );
};

export default ShipLists;
