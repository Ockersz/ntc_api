import { Box, Button, TextField, Typography } from "@mui/material";
import axios from "axios";
import React, { useLayoutEffect, useState } from "react";

const DynamicEndpoint = ({ theme, endpointInput }) => {
  const [endpoints, setEndpoints] = useState([
    {
      title: null,
      description: null,
      url: null,
      method: null,
      inputs: [{ name: null, defaultVal: null, type: null, value: null }],
    },
  ]);

  useLayoutEffect(() => {
    setEndpoints(endpointInput);
  }, [endpointInput]);

  const checkURL = (url, string) => {
    return url.endsWith(string);
  };

  async function sendPostRequest(url, data) {
    try {
      const response = await axios.post(url, data, {
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          reservationToken: localStorage.getItem("reservationToken") || null,
          "Access-Control-Allow-Origin": "*",
        },
      });
      return response;
    } catch (error) {
      return error;
    }
  }

  async function sendGetRequest(url) {
    try {
      const response = await axios.get(url, {
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          reservationToken: localStorage.getItem("reservationToken") || null,
          "Access-Control-Allow-Origin": "*",
        },
      });
      return response;
    } catch (error) {
      return error;
    }
  }

  async function sendPutRequest(url, data) {
    try {
      const response = await axios.put(url, data, {
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          reservationToken: localStorage.getItem("reservationToken") || null,
        },
      });
      return response;
    } catch (error) {
      return error;
    }
  }

  async function sendDeleteRequest(url) {
    try {
      const response = await axios.delete(url, {
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          reservationToken: localStorage.getItem("reservationToken") || null,
        },
      });
      return response;
    } catch (error) {
      return error;
    }
  }

  async function handleLogin(url, endpointObj) {
    const method = endpointObj.method;
    const inputs = endpointObj.inputs;
    try {
      const data =
        inputs &&
        inputs.reduce((acc, input) => {
          acc[input.name] = input.value ? input.value : input.defaultVal;
          return acc;
        }, {});
      let response = null;

      switch (method) {
        case "POST":
          response = await sendPostRequest(url, data);
          break;
        case "GET":
          response = await sendGetRequest(url);
          break;
        case "PUT":
          response = await sendPutRequest(url);
          break;
        case "DELETE":
          response = await sendDeleteRequest(url);
          break;
        default:
          break;
      }

      if (response.status === 200) {
        let prevEndpoints = endpoints;

        const reconstructedResponse = {
          status: response.status,
          data: [
            {
              message: response.data?.message,
              firstLogin: response.data?.firstLogin,
            },
          ],
        };
        if (response.status === 200 && response.data) {
          localStorage.setItem("accessToken", response.data?.accessToken);
          localStorage.setItem("refreshToken", response.data?.refreshToken);
        }
        prevEndpoints[0].response = reconstructedResponse;
        setEndpoints([...prevEndpoints]);
      } else {
        let prevEndpoints = endpoints;
        const errorResponse = {
          status: response.status,
          data: [{ message: response.response?.data?.message }],
        };

        prevEndpoints[0].response = errorResponse;
        setEndpoints([...prevEndpoints]);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  }

  const handleRun = async (endpointObj) => {
    let url =
      endpointObj.url.startsWith("https://") ||
      endpointObj.url.startsWith("http://")
        ? endpointObj.url
        : `https://${endpointObj.url}`;

    const isLogin = checkURL(url, "login");

    const constructData = (inputs, type) => {
      return inputs
        .filter((input) => input.type === type)
        .reduce((acc, input) => {
          acc[input.name] = input.value ? input.value : input.defaultVal;
          return acc;
        }, {});
    };

    const updateEndpoints = (url, response, isError = false) => {
      let prevEndpoints = endpoints;
      const responseObj = {
        status: response.status,
        data: isError
          ? [{ message: response.response?.data?.message }]
          : response.data,
      };

      const index = endpoints.findIndex(
        (endpoint) =>
          endpoint.url === endpointObj.url &&
          endpoint.method === endpointObj.method.toUpperCase()
      );

      prevEndpoints[index].response = responseObj;
      setEndpoints([...prevEndpoints]);
    };

    try {
      if (isLogin) {
        handleLogin(url, endpointObj);
        return;
      }

      const { method, inputs } = endpointObj;
      const bodyData = constructData(inputs, "body");
      const paramData = constructData(inputs, "param");
      const queryData = constructData(inputs, "query");

      if (paramData) {
        Object.keys(paramData).forEach((key) => {
          url = url.replace(`:${key}`, paramData[key]);
        });
      }

      if (Object.keys(queryData).length > 0) {
        url = `${url}?${new URLSearchParams(queryData).toString()}`;
      }
      let response = null;
      switch (method) {
        case "POST":
          response = await sendPostRequest(url, bodyData);
          break;
        case "GET":
          response = await sendGetRequest(url);
          break;
        case "PUT":
          response = await sendPutRequest(url, bodyData);
          break;
        case "DELETE":
          response = await sendDeleteRequest(url);
          break;
        default:
          throw new Error(`Unsupported method: ${method}`);
      }

      if (response.status === 200 || response.status === 201) {
        updateEndpoints(url, response);
      } else {
        updateEndpoints(url, response, true);
      }
    } catch (error) {
      console.error("Error handling the endpoint:", error);
    }
  };

  return (
    <Box sx={{ p: 3, backgroundColor: theme.palette.background.default }}>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Endpoints Configuration
      </Typography>

      {endpoints &&
        endpoints.map((endpoint, index) => (
          <Box
            display="grid"
            gap="10px"
            gridTemplateColumns="repeat(2, 1fr)"
            key={index}
          >
            <Box
              sx={{ display: "flex", flexDirection: "column", mb: 2 }}
              key={index}
            >
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  mb: 2,
                }}
              >
                <Typography variant="body1" sx={{ mb: 1 }}>
                  <strong>Endpoint URL:</strong> {endpoint.url}
                </Typography>
                <Typography variant="body1" sx={{ mb: 1 }}>
                  <strong>HTTP Method:</strong> {endpoint.method}
                </Typography>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
              >
                {endpoint.inputs.map((input, inputIndex) => (
                  <Box key={inputIndex} sx={{ display: "flex", mb: 2 }}>
                    <TextField
                      label={input.name}
                      name={input.name}
                      value={input.value ? input.value : input.defaultVal}
                      onChange={(e) => {
                        const newValue = e.target.value;
                        input.value = newValue;
                        let prevEndpoints = endpoints;

                        prevEndpoints[index].inputs[inputIndex].value =
                          newValue;
                        setEndpoints([...prevEndpoints]);
                      }}
                      sx={{ mr: 2 }}
                      fullWidth
                    />
                  </Box>
                ))}
              </Box>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  mb: 2,
                }}
              >
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => handleRun(endpoint)}
                >
                  Send Request
                </Button>
              </Box>
            </Box>

            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                mb: 2,
              }}
            >
              <Box sx={{ display: "flex", mb: 2 }}>
                <Typography variant="h6">Responses</Typography>
              </Box>
              {endpoint.response && (
                <Box
                  key={index}
                  sx={{
                    display: "block",
                    justifyContent: "space-between",
                    mb: 4,
                  }}
                >
                  <Typography variant="body1" sx={{ mb: 2 }}>
                    <strong>Response Code:</strong> {endpoint.response.status}
                  </Typography>
                  <Typography variant="body1">
                    <strong>Response Data:</strong>{" "}
                    {JSON.stringify(endpoint.response.data)}
                  </Typography>
                </Box>
              )}
            </Box>
          </Box>
        ))}
    </Box>
  );
};

export default DynamicEndpoint;
