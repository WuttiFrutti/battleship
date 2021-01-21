import { Box, Button } from "@material-ui/core";
import canvasTypes from "../../actions/canvas/canvasTypes";
import checkGuess from "shared/checkGuess";
import messageTypes from "shared/messageTypes";
import WebSocketClient from "../../shared/websocket";
import { useSelector } from "react-redux";


const FireButton = ({ setMessage}) => {
  const {  showing, selectedBlock, inTurn, guesses } = useSelector((state) => state.canvas);

  const sendGuess = () => {
    if (checkGuess(selectedBlock, guesses)) {
      WebSocketClient.sendMessage({ type: messageTypes.GUESS, payload: selectedBlock });
    } else {
      setMessage("Already Guessed there");
    }
  };

  return (
    selectedBlock &&
    showing !== canvasTypes.OWN &&
    inTurn && (
      <Box mt={3} mx="auto">
        <Button onClick={sendGuess} variant="contained" color="secondary">
          Fire!
        </Button>
      </Box>
    )
  );
};

export default FireButton;
