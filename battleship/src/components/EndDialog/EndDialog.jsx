import { Box, Button, Dialog, DialogTitle } from "@material-ui/core";
import { Link } from "react-router-dom";


const EndDialog = ({winner, teamCode}) => {
  return (
    <Dialog open={!!winner}>
      <DialogTitle>{winner === teamCode ? "You have won!" : "Your team has lost..."}</DialogTitle>
      <Box display="flex" m="auto">
        <Button component={Link} to="/">
          Go home
        </Button>
      </Box>
    </Dialog>
  );
};

export default EndDialog;
