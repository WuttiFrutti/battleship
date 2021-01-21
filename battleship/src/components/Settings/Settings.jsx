import { IconButton, Popover, TextField } from "@material-ui/core";
import { useState, useRef } from "react";
import SettingsIcon from "@material-ui/icons/Settings";
import "./Settings.css";
import { useDispatch, useSelector } from "react-redux";
import { changeGridSize } from "./../../actions/canvas/actions";
import ChangeShipNames from './../ChangeShipNames/ChangeShipNames';

const Settings = () => {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const settingsRef = useRef();
  const { gridSize } = useSelector((state) => state.canvas);
  const dispatch = useDispatch()

  return (
    <div>
      <IconButton
        aria-label="notifications"
        aria-controls="menu-appbar"
        aria-haspopup="true"
        onClick={() => {
          setSettingsOpen(!settingsOpen);
        }}
        color="inherit"
        ref={settingsRef}
      >
        <SettingsIcon />
      </IconButton>
      <Popover
        onClose={() => {
          setSettingsOpen(false);
        }}
        open={settingsOpen}
        anchorEl={settingsRef.current}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <div className="popover-container">
          <TextField
            type="number"
            onChange={(event) => {
              dispatch(changeGridSize(parseInt(event.target.value) || 0));
            }}
            value={gridSize || ""}
            label="Grid Size in Pixels"
          />
        </div>
        <ChangeShipNames />
      </Popover>
    </div>
  );
};

export default Settings;
