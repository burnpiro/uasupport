import * as React from "react";
import {Slide} from "@mui/material";


export const DialogTransition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});