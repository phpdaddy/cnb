import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Rate } from './types/Rate';
import { Box, Button, MenuItem, TextField } from '@mui/material';
import styled from 'styled-components';

const Root = styled('div')`
    display: flex;
    align-items: center;
    flex-direction: column;
`;

const Content = styled(Box)`
    display: flex;
    flex-direction: row;
    align-items: center;
    column-gap: 20px;
    margin-bottom: 20px;

    @media (max-width: 700px) {
        flex-direction: column;
        row-gap: 20px;
        width: 100%;
        align-items: stretch;
    }
`;

const Heading = styled(Box)`
    margin-bottom: 20px;
    text-align: center;
`;

const parseRates = (rateString: string): Rate[] => {
    const rates = [] as Rate[];
    const lines = rateString.split(/\r?\n/);

    lines
        .filter((line, index) => line.replace(/[^|]/g, '').length === 4 && index > 1)
        .forEach((line) => {
            const columns = line.split('|');

            rates.push({
                country: columns[0],
                currency: columns[1],
                amount: Number.parseFloat(columns[2]),
                code: columns[3],
                rate: Number.parseFloat(columns[4].replace(',', '.')),
            });
        });
    return rates;
};

const isValidAmount = (amount: string): boolean => {
    return !isNaN(Number.parseFloat(amount));
};
const App = () => {
    const [rates, setRates] = useState<Rate[]>([]);
    const [selectedRate, setSelectedRate] = useState<Rate | undefined>();
    const [amount, setAmount] = useState<string>('');
    const [result, setResult] = useState<number | undefined>();

    useEffect(() => {
        const fetch = async () => {
            const response = await axios.get(
                'https://www.cnb.cz/cs/financni_trhy/devizovy_trh/kurzy_devizoveho_trhu/denni_kurz.txt',
                {
                    headers: {
                        'Access-Control-Allow-Origin': '*',
                    },
                }
            );
            setRates(parseRates(response.data));
        };
        fetch();
    }, []);

    useEffect(() => {
        if (rates[0]) {
            setSelectedRate(rates[0]);
        }
    }, [rates]);

    return (
        <Root>
            <Heading sx={{ typography: 'h4' }}>Currency convertor</Heading>
            <Content>
                <TextField
                    label="Amount"
                    error={!isValidAmount(amount)}
                    helperText={!isValidAmount(amount) ? 'Not valid number!' : ''}
                    value={amount}
                    onChange={(event) => setAmount(event.target.value)}
                />
                <Box sx={{ typography: 'h5', textAlign: 'center' }}>CZK to</Box>
                <TextField
                    select
                    label="Target currency"
                    value={selectedRate?.code || ''}
                    onChange={(event) => setSelectedRate(rates.find((r) => r.code === event.target.value))}>
                    {rates.map((r) => (
                        <MenuItem key={r.code} value={r.code}>
                            {r.code} 1 : {r.rate}
                        </MenuItem>
                    ))}
                </TextField>
                <Button
                    variant="contained"
                    disabled={!isValidAmount(amount) && !!selectedRate}
                    onClick={() => {
                        selectedRate && setResult(Number.parseFloat(amount) * selectedRate.rate);
                    }}>
                    Calculate
                </Button>
            </Content>
            {result && (
                <Box sx={{ typography: 'h5', textAlign: 'center' }}>
                    {parseFloat(result.toFixed(3))} {selectedRate?.code}
                </Box>
            )}
        </Root>
    );
};

export default App;
