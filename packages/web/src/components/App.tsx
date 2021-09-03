import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { Grommet } from "grommet";
import MainPage from "./mainPage/MainPage";
import Signup from "./signup/Signup";
import Login from "./login/Login";
import Income from "./income/Income";
import Expenses from "./expenses/Expenses";
import Settings from "./settings/Settings";

const theme = {
  global: {
    colors: {
      brand: "#bf95d4",
    },
    font: {
      family: "Roboto",
      size: "18px",
      height: "20px",
    },
  },
};

function App() {
  return (
    <Grommet theme={theme} full>
      <Router>
        <Switch>
          <Route exact path="/">
            <MainPage />
          </Route>
          <Route exact path="/dashboard">
            <MainPage />
          </Route>
          <Route exact path="/signup">
            <Signup />
          </Route>
          <Route exact path="/login">
            <Login />
          </Route>
          <Route exact path="/income">
            <Income />
          </Route>
          <Route exact path="/expenses">
            <Expenses />
          </Route>
          <Route exact path="/settings">
            <Settings />
          </Route>
        </Switch>
      </Router>
    </Grommet>
  );
}

export default App;
