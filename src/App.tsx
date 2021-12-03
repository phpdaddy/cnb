import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Rate } from './types/Rate';
import { Button } from '@mui/material';

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

    return (
        <div>
            {rates.map((r) => (
                <div key={r.code}>
                    <div>{r.code}</div>
                    <div>{r.rate}</div>
                </div>
            ))}
            <Button variant="contained">Calculate</Button>
        </div>
    );
};

export default App;
