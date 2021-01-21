import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Box, Typography, TextField, Button } from "@material-ui/core";
import WebSocketClient from "../shared/websocket.js";
import messageTypes from "shared/messageTypes";

const MainPage = (props) => {
  const dispatch = useDispatch();
  const [teamCode, setTeamCode] = useState();
  const [error, setError] = useState({
    error: false,
    helperText: "",
  });

  const history = useHistory();

  const validate = () => {
    if (!teamCode) {
      setError({ error: true, helperText: "Please enter a code" });
    } else {
      WebSocketClient.sendMessage({ type: messageTypes.REGISTER_FOR_TEAM, payload: { teamCode: teamCode } });
    }
  };

  useEffect(() =>
    WebSocketClient.addOnMessageListener(({type, payload}) => {
      if(type){
        switch(type){
            case messageTypes.REGISTERED:
                WebSocketClient.registered = true;
            dispatch({ type: messageTypes.GET_STATE, payload: payload });

                history.push(`/game/${teamCode}`);
                return;
            case messageTypes.REGISTER_FAILED:
                setError({error:true,helperText:"Registration failed; Please check the code"})
                return;
            default:
                return;

        }
      }
    })
  );

  return (
    <Box display="flex" flexDirection="column" justifyContent="center">
      <Box display="flex" flexDirection="column" mx="auto" mb={3}>
        <Typography variant="h3">BattleShip!</Typography>
        <Box mx="auto"><img alt="main-icon" src="/assets/images/battleshipIcon.png"></img></Box>
      </Box>

      <form noValidate autoComplete="off">
        <Box display="flex" flexDirection="column">
          <Box m="auto" mb={3}>
            <TextField
              display="box"
              onChange={(event) => {
                setTeamCode(event.target.value);
              }}
              label="Team Code"
              error={error.error}
              helperText={error.helperText}
            />
          </Box>
          <Box m="auto">
            <Button onClick={validate} variant="contained" color="primary">
              Join
            </Button>
          </Box>
        </Box>
      </form>
    </Box>
  );
};

export default MainPage;
