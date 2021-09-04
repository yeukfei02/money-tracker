import React, { useState, useEffect } from "react";
import { Box, Button } from "grommet";
import { useHistory } from "react-router";
import CustomAppBar from "../customAppBar/CustomAppBar";
import MainContent from "../mainContent/MainContent";

function Expenses(props: any) {
  const history = useHistory();

  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);

  useEffect(() => {
    const isUserLoggedIn = localStorage.getItem("isUserLoggedIn");
    console.log("isUserLoggedIn = ", isUserLoggedIn);

    const isUserLoggedInBool = Boolean(isUserLoggedIn);
    console.log("isUserLoggedInBool = ", isUserLoggedInBool);

    setIsUserLoggedIn(isUserLoggedInBool);
  }, []);

  const expensesView = () => {
    const expensesView = (
      <Box>
        <div className="d-flex justify-content-end m-4">
          <Button
            primary
            label="Create Expense"
            onClick={() => handleCreateExpenseClick()}
          />
        </div>
      </Box>
    );
    return expensesView;
  };

  const handleCreateExpenseClick = () => {
    history.push("/expenses/create-expense");
  };

  return (
    <Box fill>
      <CustomAppBar isUserLoggedIn={isUserLoggedIn} />
      <MainContent
        isUserLoggedIn={isUserLoggedIn}
        currentPage="expenses"
        expensesView={() => expensesView()}
      />
    </Box>
  );
}

export default Expenses;
