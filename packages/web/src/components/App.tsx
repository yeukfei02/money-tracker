import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { Grommet } from "grommet";
import Dashboard from "./dashboard/Dashboard";
import Signup from "./signup/Signup";
import Login from "./login/Login";
import Incomes from "./income/Incomes";
import IncomesDetails from "./income/IncomesDetails";
import CreateIncome from "./income/CreateIncome";
import Expenses from "./expenses/Expenses";
import ExpensesDetails from "./expenses/ExpensesDetails";
import CreateExpense from "./expenses/CreateExpense";
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
            <Dashboard />
          </Route>
          <Route exact path="/dashboard">
            <Dashboard />
          </Route>
          <Route exact path="/signup">
            <Signup />
          </Route>
          <Route exact path="/login">
            <Login />
          </Route>
          <Route exact path="/incomes">
            <Incomes />
          </Route>
          <Route exact path="/incomes/details/:id">
            <IncomesDetails />
          </Route>
          <Route exact path="/incomes/create-income">
            <CreateIncome />
          </Route>
          <Route exact path="/expenses">
            <Expenses />
          </Route>
          <Route exact path="/expenses/details/:id">
            <ExpensesDetails />
          </Route>
          <Route exact path="/expenses/create-expense">
            <CreateExpense />
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
