import { Box, Typography, Button } from "@material-ui/core";
import FireButton from "./../FireButton/FireButton";
import ShipLists from "./../ShipLists/ShipLists";
import VisionSwitch from "./../VisionSwitch/VisionSwitch";
import Settings from "./../Settings/Settings";

import { useSelector } from "react-redux";
import gameStates from "shared/gameStates";
import messageTypes from "shared/messageTypes";
import WebSocketClient from "../../shared/websocket";

const SideBar = ({ setMessage }) => {
  const { state, inTurn } = useSelector((state) => state.canvas);

  const sendReady = () => {
    WebSocketClient.sendMessage({ type: messageTypes.TEAM_READY });
  };

  return state === gameStates.PLACING_SHIPS ? (
    <Box ml={3} mt={3} mb="auto" display="flex">
        <Button onClick={sendReady} variant="contained" color="primary">
          Ready
        </Button>
        <Settings />
    </Box>
  ) : (
    <Box ml={3} mt={3} display="flex" flexDirection="column">
      <Box display="flex"><Box mt={1}><Typography variant="h6">{inTurn ? "Your turn to fire:" : "Waiting for enemy to fire..."} </Typography></Box><Settings /></Box>
      <VisionSwitch />
      <FireButton setMessage={setMessage} />
      <ShipLists />
    </Box>
  );
};

export default SideBar;
