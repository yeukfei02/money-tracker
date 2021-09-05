import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Heading,
  Card,
  CardHeader,
  CardBody,
  TextInput,
  Text,
  DateInput,
  Select,
} from "grommet";
import { useParams, useHistory } from "react-router";
import CustomAppBar from "../customAppBar/CustomAppBar";
import MainContent from "../mainContent/MainContent";
import { getRootUrl } from "../../helpers/helpers";
import axios from "axios";
import dayjs from "dayjs";

function IncomesDetails(props: any) {
  const history = useHistory();

  const { id }: any = useParams();
  console.log("id = ", id);

  const [currenciesList, setCurrenciesList] = useState([]);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState("");
  const [otherType, setOtherType] = useState("");
  const [currency, setCurrency] = useState("");
  const [amount, setAmount] = useState(0);
  const [date, setDate] = useState("");

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

  useEffect(() => {
    if (id) {
      getIncomesDetailsRequest(id);
    }
  }, [id]);

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

  const getIncomesDetailsRequest = async (id: string) => {
    try {
      const rootUrl = getRootUrl();
      const token = localStorage.getItem("token");

      const response = await axios.get(`${rootUrl}/incomes/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response) {
        const responseData = response.data;
        console.log("responseData = ", responseData);

        if (responseData) {
          setName(responseData.income.name);
          setDescription(responseData.income.description);
          setType(responseData.income.type);
          setCurrency(responseData.income.currency);
          setAmount(responseData.income.amount);
        }
      }
    } catch (e) {
      console.log("error = ", e);
    }
  };

  const incomesDetailsView = () => {
    const incomesDetailsView = (
      <div>
        <div className="m-5">
          <Button
            secondary
            label="Back"
            onClick={() => handleBackButtonClick()}
          />
        </div>

        <Card className="m-5 p-3" background="light-1">
          <CardHeader pad="medium">
            <Heading level={2}>Incomes Details #{id}</Heading>
          </CardHeader>
          <CardBody pad="medium">
            <Text>Name</Text>
            <TextInput
              className="my-3"
              placeholder="Name"
              type="text"
              value={name}
              onChange={(e) => handleNameChange(e)}
            />

            <Text>Description</Text>
            <TextInput
              className="my-3"
              placeholder="Description"
              type="text"
              value={description}
              onChange={(e) => handleDescriptionChange(e)}
            />

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

            <div className="my-2"></div>

            <Text>Amount</Text>
            <TextInput
              className="my-3"
              placeholder="Amount"
              type="number"
              value={amount}
              onChange={(e) => handleAmountChange(e)}
            />

            <Text>Date</Text>
            <div className="my-2"></div>
            <DateInput
              format="yyyy-mm-dd"
              value={date}
              onChange={({ value }: any) => handleDateChange(value)}
            />

            <Button
              className="mt-4"
              secondary
              label="Update"
              onClick={() => handleUpdateClick()}
            />
          </CardBody>
        </Card>
      </div>
    );
    return incomesDetailsView;
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

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDescription(e.target.value);
  };

  const handlerTypeSelectDropdownChange = (e: any) => {
    setType(e.target.value);
    setShowTypeTextInput(false);

    if (e.target.value === "Others") {
      setShowTypeTextInput(true);
    }
  };

  const handleTypeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOtherType(e.target.value);
  };

  const handlerCurrencySelectDropdownChange = (e: any) => {
    setCurrency(e.target.value);
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const amountFloat = parseFloat(e.target.value);
    setAmount(amountFloat);
  };

  const handleDateChange = (value: any) => {
    if (value) {
      setDate(value);
    }
  };

  const updateIncomeRequest = async () => {
    try {
      const rootUrl = getRootUrl();
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userId");

      if (
        name &&
        description &&
        (type || otherType) &&
        amount > 0 &&
        date &&
        userId
      ) {
        const bodyData = {
          name: name,
          description: description,
          type: type !== "Others" ? type : otherType,
          currency: currency,
          amount: amount,
          date: date
            ? dayjs(date[0]).format("YYYY-MM-DD HH:mm:ss")
            : dayjs().format("YYYY-MM-DD HH:mm:ss"),
          user_id: userId,
        };

        const response = await axios.patch(
          `${rootUrl}/incomes/${id}`,
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

          if (responseData) {
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

  const handleUpdateClick = async () => {
    await updateIncomeRequest();
  };

  const handleBackButtonClick = () => {
    history.push("/incomes");
  };

  return (
    <Box fill>
      <CustomAppBar isUserLoggedIn={isUserLoggedIn} />
      <MainContent
        isUserLoggedIn={isUserLoggedIn}
        currentPage="incomesDetails"
        incomesDetailsView={() => incomesDetailsView()}
      />
    </Box>
  );
}

export default IncomesDetails;
