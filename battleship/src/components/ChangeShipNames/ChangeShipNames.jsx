import WebSocketClient from "../../shared/websocket";
import { useSelector } from "react-redux";
import React, { useState, useEffect } from "react";
import { Box, Typography, Grid, List, ListItem, ListItemText, TextField, Button } from "@material-ui/core";
import messageTypes from "shared/messageTypes";

const ChangeShipNames = () => {
  const { ships } = useSelector((state) => state.canvas);

  const createInput = (ships) => Object.fromEntries(Object.entries(ships).map((ship) => [ship[0], ship[1].name]));

  const [inputShips, setInputShips] = useState(createInput(ships));

  useEffect(() => {
    setInputShips(createInput(ships));
  }, [ships]);

  const saveNames = () => {
    WebSocketClient.sendMessage({ type: messageTypes.CHANGE_NAMES, payload: { names: inputShips } });
  };

  return (
    <List>
      {Object.keys(ships).map((originalName) => (
        <ListItem dense key={originalName}>
          <TextField
            InputLabelProps={{
              shrink: true,
            }}
            onChange={(event) => {
              setInputShips({ ...inputShips, [originalName]: event.target.value });
            }}
            label={originalName}
            value={inputShips[originalName]}
          />
        </ListItem>
      ))}
      <ListItem>
        <Button onClick={saveNames} variant="contained" color="primary">
          Save
        </Button>
      </ListItem>
    </List>
  );
};

export default ChangeShipNames;
