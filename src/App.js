import logo from "./logo.svg";
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
import { motion } from "framer-motion";

import uctmap from "./uctmap.png";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { blue, purple } from "@material-ui/core/colors";

const font = '"Vollkorn", Arial, Helvetica, sans-serif';
const theme = createMuiTheme({
  typography: {
    fontFamily: font,
  },
  palette: {
    primary: {
      // light: will be calculated from palette.primary.main,
      main: "#ffffff",
      // dark: will be calculated from palette.primary.main,
      // contrastText: will be calculated to contrast with palette.primary.main
    },
    secondary: {
      main: "#006cbc",
    },
    // Used by `getContrastText()` to maximize the contrast between
    // the background and the text.
    contrastThreshold: 3,
    // Used by the functions below to shift a color's luminance by approximately
    // two indexes within its tonal palette.
    // E.g., shift from Red 500 to Red 300 or Red 700.
    tonalOffset: 0.2,
  },
});

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
    >
      {name}
    </LocationButton>
  );
};

function App() {
  const classes = useStyles();

  //Reset the vh unit measurement
  let vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty("--vh", `${vh}px`);

  return (
    <ThemeProvider theme={theme}>
      <div
        style={{
          fontFamily: "Vollkorn",
          display: "flex",
          flexDirection: "column",
          height: 100 * vh,
          WebkitOverflowScrolling: "touch",
          touchAction: "none",
        }}
        overflow="hidden"
        onTouchStart={(e) => {
          e.preventDefault();
        }}
      >
        <AppBar
          position="static"
          elevation={0}
          // style={{ border: "1px solid red" }}
        >
          <Toolbar>
            <Grid container direction="row" alignItems="center">
              <Grid item></Grid>
              <Grid item>
                <Typography variant="h5" className={classes.title}>
                  UniMeet
                </Typography>
              </Grid>
            </Grid>
          </Toolbar>
        </AppBar>
        <TransformWrapper
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
            <>
              <TransformComponent>
                <div style={{ position: "relative" }}>
                  <img src={uctmap} width="100%" />
                  <LocationMarker top={500} left={250} name={"Leslie"} />
                  <LocationMarker top={480} left={680} name={"Library"} />
                  <LocationMarker top={550} left={1200} name={"RW James"} />
                  <LocationMarker top={400} left={300} name={"Menzies"} />
                  <LocationMarker top={500} left={250} name={"Leslie"} />
                </div>
              </TransformComponent>
            </>
          )}
        </TransformWrapper>
      </div>
    </ThemeProvider>
  );
}

export default App;
