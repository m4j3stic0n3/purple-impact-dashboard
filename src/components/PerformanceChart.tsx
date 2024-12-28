import { Card } from "./ui/card";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

const PORTFOLIO_VALUE = 87649.51;

const generatePerformanceData = () => {
  return Array.from({ length: 30 }, (_, i) => {
    const randomFluctuation = (Math.random() - 0.5) * 0.02;
    const value = PORTFOLIO_VALUE * (1 + randomFluctuation);
    return {
      name: `Day ${i + 1}`,
      value: Math.round(value)
    };
  });
};

export const PerformanceChart = () => {
  const performanceData = generatePerformanceData();

  return (
    <Card className="p-6 bg-dashboard-card/60 backdrop-blur-lg border-gray-800">
      <h3 className="text-lg font-semibold mb-4">Performance</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={performanceData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#444" />
            <XAxis dataKey="name" stroke="#666" />
            <YAxis stroke="#666" />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#1a1a1a', 
                border: '1px solid #333',
                borderRadius: '4px'
              }}
            />
            <Line 
              type="monotone" 
              dataKey="value" 
              stroke="#9b87f5" 
              strokeWidth={2}
              dot={{ fill: '#9b87f5' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};