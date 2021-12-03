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

    @media (max-width: 700px) {
        flex-direction: column;
        row-gap: 20px;
        width: 100%;
        align-items: stretch;
    }
`;

const Heading = styled(Box)`
    margin-bottom: 20px;
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

const App = () => {
    const [rates, setRates] = useState<Rate[]>([]);
    const [selectedCurrency, setSelectedCurrency] = useState<string>('');

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
        setSelectedCurrency(rates[0]?.code || '');
    }, [rates]);

    return (
        <Root>
            <Heading sx={{ typography: 'h4' }}>Exchange convertor</Heading>
            <Content>
                <TextField label="Amount" />
                <Box sx={{ typography: 'h5' }}>CZK to</Box>
                <TextField
                    select
                    label="Target currency"
                    value={selectedCurrency}
                    onChange={(event) => setSelectedCurrency(event.target.value)}>
                    {rates.map((r) => (
                        <MenuItem key={r.code} value={r.code}>
                            {r.code} : {r.rate}
                        </MenuItem>
                    ))}
                </TextField>
                <Button variant="contained">Calculate</Button>
            </Content>
        </Root>
    );
};

export default App;
