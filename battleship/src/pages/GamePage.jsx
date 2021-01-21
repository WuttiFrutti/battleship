import { React, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Box, Typography, Snackbar } from "@material-ui/core";

import { useParams } from "react-router-dom";
import { useHistory } from "react-router-dom";
import Canvas from "../components/Canvas";

import handler, { setup } from "./../shared/gameWebSocketHandlers";
import EndDialog from "../components/EndDialog/EndDialog";
import SideBar from "../components/SideBar/SideBar";


const GamePage = (props) => {
  const dispatch = useDispatch();
  const { ready, showing } = useSelector((state) => state.canvas);
  const [connected, setConnected] = useState();
  const { teamCode } = useParams();
  const [message, setMessage] = useState(false);
  const [winner, setWinner] = useState(false);
  const history = useHistory();

  useEffect(() => setup(setConnected, connected, teamCode), [teamCode, connected]);

  useEffect(() => handler(setMessage, setWinner, history, dispatch, showing, ready, setConnected), [setMessage, setWinner, dispatch, history, ready, showing]);

  return !connected ? (
    <Box>
      <Typography variant="h5">Connecting...</Typography>
    </Box>
  ) : (
    <Box display="flex" flexWrap="wrap">
      <Canvas width={props.width} height={props.height} />
      <SideBar setMessage={setMessage} />
      <Snackbar open={!!message} onClose={() => setMessage(false)} message={message} key={message} />
      <EndDialog teamCode={teamCode} winner={winner} />
    </Box>
  );
};

export default GamePage;
