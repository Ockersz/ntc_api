import { Box, Paper, TextField, Typography } from "@mui/material";
import Grid from "@mui/material/Grid2";
import React, { useState } from "react";

const DynamicEndpoint = ({ theme, endpoints }) => {
  const [inputValues, setInputValues] = useState(
    endpoints && endpoints.map((endpoint) => endpoint.inputs.map(() => ""))
  );

  console.log("DynamicEndpoint -> inputValues", endpoints);

  const handleInputChange = (endpointIndex, inputIndex, value) => {
    const newInputValues = [...inputValues];
    newInputValues[endpointIndex][inputIndex] = value;
    setInputValues(newInputValues);
  };

  return (
    <Box sx={{ p: 3, backgroundColor: theme.palette.background.default }}>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Endpoints Configuration
      </Typography>
      {endpoints &&
        endpoints?.map((endpoint, index) => (
          <Paper elevation={3} sx={{ p: 2, mb: 3 }} key={index}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Typography variant="body1">
                  <strong>Endpoint URL:</strong> {endpoint.url}
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="body1">
                  <strong>HTTP Method:</strong> {endpoint.method}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="h6">Inputs</Typography>
                {endpoint.inputs.map((input, inputIndex) => (
                  <Box key={inputIndex} sx={{ display: "flex", mb: 2 }}>
                    <TextField
                      label={input.name}
                      value={inputValues[index][inputIndex]}
                      onChange={(e) =>
                        handleInputChange(index, inputIndex, e.target.value)
                      }
                      sx={{ mr: 2 }}
                      fullWidth
                    />
                  </Box>
                ))}
              </Grid>
              <Grid item xs={12}>
                <Typography variant="h6">Responses</Typography>
                {endpoint &&
                  endpoint.response &&
                  endpoint.response.map((response, responseIndex) => (
                    <Box key={responseIndex} sx={{ mb: 2 }}>
                      <Typography variant="body1">
                        <strong>Response Code:</strong> {response.code}
                      </Typography>
                      <Typography variant="body1">
                        <strong>Response Data:</strong> {response.data}
                      </Typography>
                    </Box>
                  ))}
              </Grid>
            </Grid>
          </Paper>
        ))}
    </Box>
  );
};

export default DynamicEndpoint;
