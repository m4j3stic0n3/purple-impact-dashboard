import { Card } from "@/components/ui/card";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

const COLORS = ['#9b87f5', '#7E69AB', '#6E59A5', '#3a108c'];

interface PortfolioCompositionProps {
  data: Array<{
    name: string;
    value: number;
  }>;
}

export const PortfolioComposition = ({ data }: PortfolioCompositionProps) => {
  return (
    <Card className="p-6 bg-dashboard-card/60 backdrop-blur-lg border-gray-800">
      <h3 className="text-lg font-semibold mb-4">Portfolio Composition</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};