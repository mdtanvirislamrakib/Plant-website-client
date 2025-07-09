import React from 'react';
import { CartesianGrid, Legend, Line, LineChart, Tooltip, XAxis, YAxis } from 'recharts';


const OrderChart = ({ barChartData }) => {
    return (
        <div>
            <LineChart width={930} height={350} data={barChartData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="order" stroke="#8884d8" />
                <Line type="monotone" dataKey="revenew" stroke="#82ca9d" />
            </LineChart>
        </div>
    );
};

export default OrderChart;