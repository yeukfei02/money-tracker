import React, { useState, useEffect } from "react";
import { Box } from "grommet";
import CustomAppBar from "../customAppBar/CustomAppBar";
import MainContent from "../mainContent/MainContent";

function Income(props: any) {
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);

  useEffect(() => {
    const isUserLoggedIn = localStorage.getItem("isUserLoggedIn");
    console.log("isUserLoggedIn = ", isUserLoggedIn);

    const isUserLoggedInBool = Boolean(isUserLoggedIn);
    console.log("isUserLoggedInBool = ", isUserLoggedInBool);

    setIsUserLoggedIn(isUserLoggedInBool);
  }, []);

  return (
    <Box fill>
      <CustomAppBar isUserLoggedIn={isUserLoggedIn} />
      <MainContent isUserLoggedIn={isUserLoggedIn} currentPage="income" />
    </Box>
  );
}

export default Income;
