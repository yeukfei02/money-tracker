import React, { useState, useEffect } from "react";
import { Box } from "grommet";
import {
  AreaChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Area,
  Legend,
  BarChart,
  Bar,
  ComposedChart,
  Line,
} from "recharts";
import { getRootUrl } from "../../helpers/helpers";
import axios from "axios";
import CustomAppBar from "../customAppBar/CustomAppBar";
import MainContent from "../mainContent/MainContent";

function Dashboard() {
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);

  const [incomesData, setIncomesData] = useState([]);
  const [expensesData, setExpensesData] = useState([]);

  useEffect(() => {
    const isUserLoggedIn = localStorage.getItem("isUserLoggedIn");
    console.log("isUserLoggedIn = ", isUserLoggedIn);

    const isUserLoggedInBool = Boolean(isUserLoggedIn);
    console.log("isUserLoggedInBool = ", isUserLoggedInBool);

    setIsUserLoggedIn(isUserLoggedInBool);

    getDashboardData();
  }, []);

  const getDashboardData = async () => {
    try {
      const rootUrl = getRootUrl();
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userId");

      const response = await axios.get(`${rootUrl}/dashboard`, {
        params: {
          userId: userId,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response) {
        const responseData = response.data;
        console.log("responseData = ", responseData);

        if (responseData) {
          setIncomesData(responseData.incomesData);
          setExpensesData(responseData.expensesData);
        }
      }
    } catch (e) {
      console.log("error = ", e);
    }
  };

  const dashboardView = () => {
    let dashboardView = null;

    if (incomesData && expensesData) {
      dashboardView = (
        <div>
          <div className="d-flex justify-content-center my-5">
            <h3>Incomes</h3>
          </div>

          <div className="d-flex justify-content-center">
            <AreaChart
              width={window.innerWidth / 2}
              height={400}
              data={incomesData}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorPv" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#82ca9d" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="date" />
              <YAxis dataKey="amount" />
              <CartesianGrid strokeDasharray="3 3" />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="date"
                stroke="#8884d8"
                fillOpacity={1}
                fill="url(#colorUv)"
              />
              <Area
                type="monotone"
                dataKey="amount"
                stroke="#82ca9d"
                fillOpacity={1}
                fill="url(#colorPv)"
              />
            </AreaChart>
          </div>

          <div className="d-flex justify-content-center my-5">
            <BarChart
              width={window.innerWidth / 2}
              height={400}
              data={incomesData}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis dataKey="amount" />
              <Tooltip />
              <Legend />
              <Bar dataKey="date" fill="#8884d8" />
              <Bar dataKey="amount" fill="#82ca9d" />
            </BarChart>
          </div>

          <div className="d-flex justify-content-center my-5">
            <ComposedChart
              width={window.innerWidth / 2}
              height={400}
              data={incomesData}
            >
              <XAxis dataKey="date" />
              <YAxis dataKey="amount" />
              <Tooltip />
              <Legend />
              <CartesianGrid stroke="#f5f5f5" />
              <Area
                type="monotone"
                dataKey="date"
                fill="#8884d8"
                stroke="#8884d8"
              />
              <Bar dataKey="name" barSize={20} fill="#413ea0" />
              <Line type="monotone" dataKey="amount" stroke="#ff7300" />
            </ComposedChart>
          </div>

          <div className="d-flex justify-content-center my-5">
            <h3>Expenses</h3>
          </div>

          <div className="d-flex justify-content-center">
            <AreaChart
              width={window.innerWidth / 2}
              height={400}
              data={expensesData}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorPv" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#82ca9d" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="date" />
              <YAxis dataKey="amount" />
              <CartesianGrid strokeDasharray="3 3" />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="date"
                stroke="#8884d8"
                fillOpacity={1}
                fill="url(#colorUv)"
              />
              <Area
                type="monotone"
                dataKey="amount"
                stroke="#82ca9d"
                fillOpacity={1}
                fill="url(#colorPv)"
              />
            </AreaChart>
          </div>

          <div className="d-flex justify-content-center my-5">
            <BarChart
              width={window.innerWidth / 2}
              height={400}
              data={expensesData}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis dataKey="amount" />
              <Tooltip />
              <Legend />
              <Bar dataKey="date" fill="#8884d8" />
              <Bar dataKey="amount" fill="#82ca9d" />
            </BarChart>
          </div>

          <div className="d-flex justify-content-center my-5">
            <ComposedChart
              width={window.innerWidth / 2}
              height={400}
              data={expensesData}
            >
              <XAxis dataKey="date" />
              <YAxis dataKey="amount" />
              <Tooltip />
              <Legend />
              <CartesianGrid stroke="#f5f5f5" />
              <Area
                type="monotone"
                dataKey="date"
                fill="#8884d8"
                stroke="#8884d8"
              />
              <Bar dataKey="name" barSize={20} fill="#413ea0" />
              <Line type="monotone" dataKey="amount" stroke="#ff7300" />
            </ComposedChart>
          </div>
        </div>
      );
    }

    return dashboardView;
  };

  return (
    <Box fill>
      <CustomAppBar isUserLoggedIn={isUserLoggedIn} />
      <MainContent
        isUserLoggedIn={isUserLoggedIn}
        currentPage="dashboard"
        dashboardView={() => dashboardView()}
      />
    </Box>
  );
}

export default Dashboard;
