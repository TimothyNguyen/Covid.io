import React from 'react';
import styles from './App.module.css';
import { Dashboard } from './components';
import { 
  AppBar,
  Toolbar,
  Typography,
  Button,
  createMuiTheme, 
  Switch, 
  FormControlLabel, 
  ThemeProvider 
} from '@material-ui/core';
import CssBaseline from '@material-ui/core/CssBaseline';

function App() {
  const [darkMode, setDarkMode] = React.useState(true);

  const theme = React.useMemo(
    () =>
      createMuiTheme({
        palette: {
          type: darkMode ? 'dark' : 'light',
        },
      }),
    [darkMode],
  );

  const handleChange = (event) => {
    setDarkMode(event.target.checked);
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline/>
      <Dashboard />   
      <FormControlLabel
        control={
          <Switch
            checked={darkMode}
            onChange={handleChange}
            name="checkedB"
            color="primary"
          />
        }
        label="Light/Dark"
      />
    </ThemeProvider>
  );
}

export default App;
