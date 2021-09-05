import React, { useState, useEffect } from "react";
import { Box, Button } from "grommet";
import { useHistory } from "react-router";
import { getRootUrl } from "../../helpers/helpers";
import axios from "axios";
import CustomAppBar from "../customAppBar/CustomAppBar";
import MainContent from "../mainContent/MainContent";
import IncomesTable from "./IncomesTable";

function Incomes(props: any) {
  const history = useHistory();

  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);

  useEffect(() => {
    const isUserLoggedIn = localStorage.getItem("isUserLoggedIn");
    console.log("isUserLoggedIn = ", isUserLoggedIn);

    const isUserLoggedInBool = Boolean(isUserLoggedIn);
    console.log("isUserLoggedInBool = ", isUserLoggedInBool);

    setIsUserLoggedIn(isUserLoggedInBool);
  }, []);

  const incomesView = () => {
    const incomesView = (
      <Box>
        <div className="d-flex justify-content-end mx-5 mt-4">
          <Button
            secondary
            label="Create Income"
            onClick={() => handleCreateIncomeClick()}
          />
        </div>
        <div className="d-flex justify-content-end mx-5 my-4">
          <Button
            secondary
            label="Delete All"
            onClick={() => handleDeleteAllClick()}
          />
        </div>
        <IncomesTable />
      </Box>
    );
    return incomesView;
  };

  const handleCreateIncomeClick = () => {
    history.push("/incomes/create-income");
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
        `${rootUrl}/incomes/delete-all`,
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
        currentPage="incomes"
        incomesView={() => incomesView()}
      />
    </Box>
  );
}

export default Incomes;
