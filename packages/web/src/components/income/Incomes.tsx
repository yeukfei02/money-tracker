import React, { useState, useEffect } from "react";
import { Box, Button } from "grommet";
import { useHistory } from "react-router";
import CustomAppBar from "../customAppBar/CustomAppBar";
import MainContent from "../mainContent/MainContent";

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
        <div className="d-flex justify-content-end m-4">
          <Button
            primary
            label="Create Income"
            onClick={() => handleCreateIncomeClick()}
          />
        </div>
      </Box>
    );
    return incomesView;
  };

  const handleCreateIncomeClick = () => {
    history.push("/incomes/create-income");
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
