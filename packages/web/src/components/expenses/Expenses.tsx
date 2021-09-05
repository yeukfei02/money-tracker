import React, { useState, useEffect } from "react";
import { Box, Button } from "grommet";
import { useHistory } from "react-router";
import { getRootUrl } from "../../helpers/helpers";
import axios from "axios";
import CustomAppBar from "../customAppBar/CustomAppBar";
import MainContent from "../mainContent/MainContent";
import ExpensesTable from "./ExpensesTable";

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
        <div className="d-flex justify-content-end mx-5 mt-4">
          <Button
            secondary
            label="Create Expense"
            onClick={() => handleCreateExpenseClick()}
          />
        </div>
        <div className="d-flex justify-content-end mx-5 my-4">
          <Button
            secondary
            label="Delete All"
            onClick={() => handleDeleteAllClick()}
          />
        </div>
        <ExpensesTable />
      </Box>
    );
    return expensesView;
  };

  const handleCreateExpenseClick = () => {
    history.push("/expenses/create-expense");
  };

  const handleDeleteAllClick = async () => {
    await deleteAllIncomeRequest();
  };

  const deleteAllIncomeRequest = async () => {
    try {
      const rootUrl = getRootUrl();
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userId");

      const bodyData = {
        userId: userId,
      };

      const response = await axios.post(
        `${rootUrl}/expenses/delete-all`,
        bodyData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response) {
        const responseData = response.data;
        console.log("responseData = ", responseData);

        if (response.status === 200) {
          window.location.reload();
        }
      }
    } catch (e) {
      console.log("error =", e);
    }
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
