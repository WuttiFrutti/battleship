import { setReady } from "../actions/system/sharedActions";
import { stateChange } from "./../actions/system/sharedActions";
import { selectBlock } from "../actions/canvas/actions";
import canvasTypes from "./../actions/canvas/canvasTypes";
import WebSocketClient from "./websocket";
import messageTypes from "shared/messageTypes";
import { switchVision } from "./../actions/canvas/actions";

export const setup = (setConnected, connected, teamCode) => {
  const callDisconnect = () => {
    setConnected(false)
  }
  const callRegister = () => {
    if (!connected) {
      WebSocketClient.sendMessage({ type: messageTypes.REGISTER_FOR_TEAM, payload: { teamCode: teamCode } });
    } else {
      setConnected(true);
    }
    WebSocketClient.addOnOpenListener(callRegister);
    WebSocketClient.addOnCloseListener(callDisconnect);
  };


  WebSocketClient.openConnection();
  callRegister();
  return () => {
    WebSocketClient.removeOnOpenListener(callRegister);
    WebSocketClient.removeOnCloseListener(callDisconnect);
  }
}

const handler = (setMessage, setWinner, history, dispatch, showing, ready, setConnected) =>
  WebSocketClient.addOnMessageListener(({ type, payload }) => {
    if (type) {
      switch (type) {
        case messageTypes.GAME_ENDED:
          if (showing === canvasTypes.OTHER) dispatch(switchVision());
          setWinner(payload.winner);
          return;
        case messageTypes.GUESS:
          if (payload.sunk) {
            setMessage(`You sunk the enemy ${payload.sunk}`);
          } else if (payload.guess.hit) {
            setMessage("You hit an enemy ship!");
          }
          dispatch({ type, payload });
          return;
        case messageTypes.ENEMY_GUESS:
          if (payload.sunk) {
            setMessage(`The enemy sunk your ${payload.sunk}`);
          } else if (payload.guess.hit) {
            setMessage("One of your ships has been hit!");
          }
          dispatch({ type, payload });
          return;
        case messageTypes.SELECT_BLOCK:
          dispatch(selectBlock({ x: payload.x, y: payload.y }));
          return;
        case messageTypes.GET_STATE:
          dispatch({ type: messageTypes.GET_STATE, payload: payload });
          return;
        case messageTypes.STATE_CHANGE:
          dispatch(stateChange(payload.state, payload.inTurn));
          return;
        case messageTypes.REGISTERED:
          setConnected(true);
          dispatch({ type: messageTypes.GET_STATE, payload: payload });
          return;
        case messageTypes.REGISTER_FAILED:
          WebSocketClient.closeConnection();
          history.push(`/`);
          return;
        case messageTypes.TEAM_READY:
          if (payload.ready && !ready) {
            setMessage("Your team is ready");
          } else if (!payload.ready && ready) {
            setMessage("Team set unready");
          } else if (!payload.ready && !ready) {
            setMessage("Please check your ships");
          }
          dispatch(setReady(payload.ready));
          return;
        default:
          return;
      }
    }
  })


export default handler;