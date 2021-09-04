import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Card,
  CardHeader,
  Heading,
  CardBody,
  TextInput,
  Select,
  TextArea,
  Text,
} from "grommet";
import { useHistory } from "react-router";
import axios from "axios";
import { getRootUrl } from "../../helpers/helpers";
import CustomAppBar from "../customAppBar/CustomAppBar";
import MainContent from "../mainContent/MainContent";

function CreateIncome(props: any) {
  const history = useHistory();

  const [currenciesList, setCurrenciesList] = useState([]);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState("");
  const [otherType, setOtherType] = useState("");
  const [currency, setCurrency] = useState("");
  const [amount, setAmount] = useState(0);

  const [showTypeTextInput, setShowTypeTextInput] = useState(false);

  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);

  useEffect(() => {
    const isUserLoggedIn = localStorage.getItem("isUserLoggedIn");
    console.log("isUserLoggedIn = ", isUserLoggedIn);

    const isUserLoggedInBool = Boolean(isUserLoggedIn);
    console.log("isUserLoggedInBool = ", isUserLoggedInBool);

    setIsUserLoggedIn(isUserLoggedInBool);

    getCurrenciesRequest();
  }, []);

  const getCurrenciesRequest = async () => {
    try {
      const rootUrl = getRootUrl();
      const token = localStorage.getItem("token");

      const response = await axios.get(`${rootUrl}/currencies`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response) {
        const responseData = response.data;
        console.log("responseData = ", responseData);

        if (responseData) {
          const currenciesList = responseData.currencies;
          if (currenciesList) {
            const formattedCurrenciesList = currenciesList.map(
              (item: any, i: number) => {
                return item ? item.name : "";
              }
            );
            setCurrenciesList(formattedCurrenciesList);
          }
        }
      }
    } catch (e) {
      console.log("error = ", e);
    }
  };

  const createIncomeView = () => {
    const createIncomeView = (
      <div>
        <Card className="m-5 p-3" background="light-1">
          <CardHeader pad="medium">
            <Heading level={2}>Create income</Heading>
          </CardHeader>
          <CardBody pad="medium">
            <div className="my-3">
              <Text>Name</Text>
              <div className="my-2"></div>
              <TextInput
                placeholder="Name"
                type="text"
                value={name}
                onChange={(e) => handleNameChange(e)}
              />
            </div>

            <div className="my-3">
              <Text>Description</Text>
              <div className="my-2"></div>
              <TextArea
                placeholder="Description"
                value={description}
                onChange={(e) => handleDescriptionChange(e)}
              />
            </div>

            <Text>Type</Text>
            <div className="my-2"></div>
            <Select
              options={["Salary", "Stocks", "Others"]}
              value={type}
              onChange={(e) => handlerTypeSelectDropdownChange(e)}
            />
            {renderTypeTextInput(showTypeTextInput)}

            <div className="my-2"></div>

            <Text>Currency</Text>
            <div className="my-2"></div>
            <Select
              options={currenciesList}
              value={currency}
              onChange={(e) => handlerCurrencySelectDropdownChange(e)}
            />

            <div className="my-3">
              <Text>Amount</Text>
              <div className="my-2"></div>
              <TextInput
                placeholder="Amount"
                type="number"
                value={amount}
                onChange={(e) => handleAmountChange(e)}
              />
            </div>

            <Button
              className="mt-3"
              secondary
              label="Create Income"
              onClick={() => handleCreateIncomeClick()}
            />
          </CardBody>
        </Card>
      </div>
    );
    return createIncomeView;
  };

  const renderTypeTextInput = (showTypeTextInput: boolean) => {
    let typeTextInput = null;

    if (showTypeTextInput) {
      typeTextInput = (
        <TextInput
          className="my-3"
          placeholder="Type"
          type="text"
          value={otherType}
          onChange={(e) => handleTypeChange(e)}
        />
      );
    }

    return typeTextInput;
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  const handleDescriptionChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setDescription(e.target.value);
  };

  const handlerTypeSelectDropdownChange = (e: any) => {
    setType(e.target.value);
    setShowTypeTextInput(false);

    if (e.target.value === "Others") {
      setShowTypeTextInput(true);
    }
  };

  const handlerCurrencySelectDropdownChange = (e: any) => {
    setCurrency(e.target.value);
  };

  const handleTypeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOtherType(e.target.value);
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const valueFloat = parseFloat(e.target.value);
    setAmount(valueFloat);
  };

  const createIncomeRequest = async () => {
    try {
      const rootUrl = getRootUrl();
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userId");

      if (name && description && (type || otherType) && amount > 0 && userId) {
        const bodyData = {
          name: name,
          description: description,
          type: type !== "Others" ? type : otherType,
          currency: currency,
          amount: amount,
          user_id: userId,
        };

        const response = await axios.post(
          `${rootUrl}/incomes/create-income`,
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
            setTimeout(() => {
              history.push("/incomes");
            }, 1500);
          }
        }
      }
    } catch (e) {
      console.log("error = ", e);
    }
  };

  const handleCreateIncomeClick = async () => {
    await createIncomeRequest();
  };

  return (
    <Box fill>
      <CustomAppBar isUserLoggedIn={isUserLoggedIn} />
      <MainContent
        isUserLoggedIn={isUserLoggedIn}
        currentPage="create-income"
        createIncomeView={() => createIncomeView()}
      />
    </Box>
  );
}

export default CreateIncome;
