import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { createTheme, ThemeProvider } from '@mui/material';

const customTheme = createTheme({
    palette: {
        primary: {
            main: '#7fb220',
        },
    },
});
ReactDOM.render(
    <React.StrictMode>
        <ThemeProvider theme={customTheme}>
            <App />
        </ThemeProvider>
    </React.StrictMode>,
    document.getElementById('root')
);
