import React, { useState } from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import LeslieSocial from "./LeslieSocial";
import reportWebVitals from "./reportWebVitals";

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
import DialogTitle from "@material-ui/core/DialogTitle";
import Dialog from "@material-ui/core/Dialog";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import TextField from "@material-ui/core/TextField";

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect,
  useRouteMatch,
  useHistory,
} from "react-router-dom";

import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import Chip from "@material-ui/core/Chip";

// import Room from "./room.js";

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

const Index = () => {
  const classes = useStyles();
  const history = useHistory();

  const [startDialogOpen, setStartDialogOpen] = useState(true);
  const [name, setName] = useState("");

  //Reset the vh unit measurement
  let vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty("--vh", `${vh}px`);

  const handleCloseStartDialog = () => {
    setStartDialogOpen(false);
  };

  const handleChangeName = (event) => {
    setName(event.target.value);
  };

  const handleEnter = (event) => {
    handleCloseStartDialog();
  };

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
      >
        <AppBar
          position="static"
          elevation={0}
          style={{ border: "1px solid red" }}
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
        <Dialog
          onClose={handleCloseStartDialog}
          aria-labelledby="simple-dialog-title"
          open={startDialogOpen}
          disableBackdropClick
          disableEscapeKeyDown
          BackdropProps={{
            classes: {
              root: classes.startBackdrop,
            },
          }}
        >
          <DialogTitle id="simple-dialog-title">Welcome to UniMeet</DialogTitle>
          <Card className={classes.root} variant="outlined">
            <CardContent>
              <Grid
                container
                direction="column"
                justify="center"
                alignItems="center"
                spacing={2}
              >
                <Grid item style={{ width: "100%" }}>
                  <TextField
                    label="Name"
                    autoComplete="current-password"
                    variant="filled"
                    value={name}
                    onChange={handleChangeName}
                  />
                </Grid>
                <Grid item className={classes.formControl}>
                  <Button
                    variant={"contained"}
                    disableElevation
                    onClick={handleEnter}
                    width="100%"
                    disabled={name === ""}
                    color={"secondary"}
                  >
                    Enter UCT
                  </Button>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Dialog>
        <Switch>
          <Route path="/" exact>
            <App
              handleCloseStartDialog={handleCloseStartDialog}
              handleEnter={handleEnter}
              handleChangeName={handleChangeName}
            />
          </Route>
          <Route path="/Leslie" exact>
            <LeslieSocial
                handleCloseStartDialog={handleCloseStartDialog}
                handleEnter={handleEnter}
                handleChangeName={handleChangeName}
            />
          </Route>
          {/* <Route path="/room/:roomID">
            <Room name={name} />
          </Route> */}
        </Switch>
      </div>
    </ThemeProvider>
  );
};

ReactDOM.render(
  <Router>
    <Index />
  </Router>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
