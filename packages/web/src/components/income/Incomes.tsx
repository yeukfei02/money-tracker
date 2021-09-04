import React, { useState, useEffect } from "react";
import { Box, Button } from "grommet";
import { useHistory } from "react-router";
import CustomAppBar from "../customAppBar/CustomAppBar";
import MainContent from "../mainContent/MainContent";
import IncomesTable from "./IncomesTable";
import dayjs from "dayjs";
import axios from "axios";
import { getRootUrl } from "../../helpers/helpers";

function Incomes(props: any) {
  const history = useHistory();

  const [data, setData] = useState([]);

  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);

  useEffect(() => {
    const isUserLoggedIn = localStorage.getItem("isUserLoggedIn");
    console.log("isUserLoggedIn = ", isUserLoggedIn);

    const isUserLoggedInBool = Boolean(isUserLoggedIn);
    console.log("isUserLoggedInBool = ", isUserLoggedInBool);

    setIsUserLoggedIn(isUserLoggedInBool);

    getIncomesListRequest();
  }, []);

  const getIncomesListRequest = async () => {
    try {
      const rootUrl = getRootUrl();
      const token = localStorage.getItem("token");

      const response = await axios.get(`${rootUrl}/incomes`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response) {
        const responseData = response.data;
        console.log("responseData = ", responseData);

        if (responseData) {
          const incomesList = responseData.incomes;
          const formattedIncomesList = incomesList.map(
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
          setData(formattedIncomesList);
        }
      }
    } catch (e) {
      console.log("error = ", e);
    }
  };

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
        <IncomesTable data={data} />
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
