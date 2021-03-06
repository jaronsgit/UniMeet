import { useState, useEffect, useRef, forwardRef } from "react";
import "./App.css";
import "./styles.css";
import {
  makeStyles,
  withStyles,
  lighten,
  createMuiTheme,
  ThemeProvider,
} from "@material-ui/core/styles";

import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";

import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import Chip from "@material-ui/core/Chip";

import Snackbar from "@material-ui/core/Snackbar";
import SnackbarContent from "@material-ui/core/SnackbarContent";

import Paper from "@material-ui/core/Paper";

import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";

import LinearProgress from "@material-ui/core/LinearProgress";

import DialogTitle from "@material-ui/core/DialogTitle";
import Dialog from "@material-ui/core/Dialog";

import TextField from "@material-ui/core/TextField";

import { motion } from "framer-motion";

import uctmap from "./uctmap.png";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { blue, purple } from "@material-ui/core/colors";

import { useHistory, useParams } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  mainIcon: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    heigh: "100%",
    marginRight: theme.spacing(1.5),
    height: "36",
    width: "36",
    marginBottom: "4px",
  },
  title: {
    marginRight: theme.spacing(2),
    fontWeight: "700",
    marginTop: "2px",
  },
  toolbarTools: {
    flexGrow: 1,
  },
  cardRoot: {
    maxWidth: 345,
  },
  media: {
    height: 140,
  },
}));

const LocationButton = withStyles((theme) => ({
  root: {
    color: theme.palette.getContrastText(blue[500]),
    backgroundColor: blue[500],
    "&:hover": {
      backgroundColor: blue[700],
    },
  },
}))(Button);

//250, 500

const LocationMarker = ({ top, left, name }) => {
  const history = useHistory();
  return (
    <LocationButton
      variant="contained"
      style={{
        position: "absolute",
        left: `${left}px`,
        top: `${top}px`,
      }}
      component={motion.div}
      whileHover={{
        scale: 1.2,
        transition: { duration: 0.3 },
      }}
      whileTap={{ scale: 0.9 }}
      onClick={() => history.push(`/${name}`)}
    >
      {name}
    </LocationButton>
  );
};

function App(props) {
  const classes = useStyles();
  console.log(props);

  const history = useHistory();
  // let { roomID } = useParams();

  return (
    <div style={{ width: "100%", height: "100%" }}>
      <TransformWrapper
        style={{ width: "100%", height: "100%" }}
        options={{
          limitToBounds: false,
        }}
        wheel={{
          wheelEnabled: true,
          touchPadEnabled: true,
          limitsOnWheel: false,
          step: 60,
        }}
      >
        {({
          zoomIn,
          zoomOut,
          resetTransform,
          setDefaultState,
          positionX,
          positionY,
          scale,
          previousScale,
          options: { limitToBounds, transformEnabled, disabled },
          ...rest
        }) => (
          <div style={{ width: "100%", height: "100%" }}>
            <TransformComponent style={{ width: "100%", height: "100%" }}>
              <div style={{ position: "relative" }}>
                <img src={uctmap} width="1500px" />
                <LocationMarker top={540} left={270} name={"Leslie"} />
                <LocationMarker top={430} left={720} name={"Library"} />
                <LocationMarker top={580} left={1250} name={"RW-James"} />
                <LocationMarker top={410} left={300} name={"Menzies"} />
              </div>
            </TransformComponent>
          </div>
        )}
      </TransformWrapper>
    </div>
  );
}

export default App;
