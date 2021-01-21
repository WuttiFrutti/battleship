import { Box, Switch } from "@material-ui/core";
import { switchVision } from "../../actions/canvas/actions";
import canvasTypes from "../../actions/canvas/canvasTypes";
import { useDispatch, useSelector } from "react-redux";


const VisionSwitch = () => {
  const dispatch = useDispatch();
  const { showing } = useSelector((state) => state.canvas);


  return (
    <Box>
      Own ships
      <Switch
        size="small"
        checked={showing !== canvasTypes.OWN}
        onChange={() => {
          dispatch(switchVision());
        }}
      />
      Guesses
    </Box>
  );
};

export default VisionSwitch;
