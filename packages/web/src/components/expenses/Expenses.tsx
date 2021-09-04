import React, { useState, useEffect } from "react";
import { Box, Button } from "grommet";
import { useHistory } from "react-router";
import CustomAppBar from "../customAppBar/CustomAppBar";
import MainContent from "../mainContent/MainContent";
import ExpensesTable from "./ExpensesTable";
import dayjs from "dayjs";
import axios from "axios";
import { getRootUrl } from "../../helpers/helpers";

function Expenses(props: any) {
  const history = useHistory();

  const [data, setData] = useState([]);

  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);

  useEffect(() => {
    const isUserLoggedIn = localStorage.getItem("isUserLoggedIn");
    console.log("isUserLoggedIn = ", isUserLoggedIn);

    const isUserLoggedInBool = Boolean(isUserLoggedIn);
    console.log("isUserLoggedInBool = ", isUserLoggedInBool);

    setIsUserLoggedIn(isUserLoggedInBool);

    getExpensesListRequest();
  }, []);

  const getExpensesListRequest = async () => {
    try {
      const rootUrl = getRootUrl();
      const token = localStorage.getItem("token");

      const response = await axios.get(`${rootUrl}/expenses`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response) {
        const responseData = response.data;
        console.log("responseData = ", responseData);

        if (responseData) {
          const expensesList = responseData.expenses;
          const formattedExpensesList = expensesList.map(
            (item: any, i: number) => {
              if (item) {
                item.created_at = dayjs(item.created_at).format(
                  "YYYY-MM-DD HH:mm:ss"
                );
                item.updated_at = dayjs(item.updated_at).format(
                  "YYYY-MM-DD HH:mm:ss"
                );
              }

              return item;
            }
          );
          setData(formattedExpensesList);
        }
      }
    } catch (e) {
      console.log("error = ", e);
    }
  };

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
        <ExpensesTable data={data} />
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
