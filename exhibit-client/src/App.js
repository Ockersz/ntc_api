import { Brightness4, Brightness7 } from "@mui/icons-material";
import {
  AppBar,
  Box,
  CssBaseline,
  IconButton,
  Tab,
  Tabs,
  Toolbar,
  Typography,
} from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import React, { useState } from "react";
import BusOperator from "./pages/BusOperator";
import Commuter from "./pages/Commuter";
import NtcAdmin from "./pages/NtcAdmin";

function TabPanel(props) {
  const { children, value, index, ...other } = props;
  //test application
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

function App() {
  const [value, setValue] = useState(0);
  const [darkMode, setDarkMode] = useState(false);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleThemeChange = () => {
    setDarkMode(!darkMode);
  };

  const theme = createTheme({
    palette: {
      mode: darkMode ? "dark" : "light",
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div className="App">
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Welcome to NTC
            </Typography>
            <IconButton
              edge="end"
              color="inherit"
              aria-label="mode"
              onClick={handleThemeChange}
            >
              {darkMode ? <Brightness7 /> : <Brightness4 />}
            </IconButton>
          </Toolbar>
        </AppBar>
        <Box
          sx={{
            width: "100%",
            bgcolor: "background.paper",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            mt: 2,
          }}
        >
          <Tabs
            value={value}
            onChange={handleChange}
            aria-label="basic tabs example"
          >
            <Tab label="NTC Admin" {...a11yProps(0)} />
            <Tab label="Bus Operator" {...a11yProps(1)} />
            <Tab label="Commuter" {...a11yProps(2)} />
          </Tabs>
          <TabPanel value={value} index={0}>
            <NtcAdmin theme={theme} />
          </TabPanel>
          <TabPanel value={value} index={1}>
            <BusOperator theme={theme} />
          </TabPanel>
          <TabPanel value={value} index={2}>
            <Commuter theme={theme} />
          </TabPanel>
        </Box>
      </div>
    </ThemeProvider>
  );
}

export default App;
