'use client';

import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { gql } from '@apollo/client';
import client from '@/lib/apollo-client';

// Define the data structure for the chart
interface ChartDataItem {
  name: string;
  value: number;
}

// Define the structure of the GraphQL response
interface AttestationGroup {
  isOffchain: boolean;
  _count: {
    _all: number;
  };
}

interface QueryResponse {
  groupByAttestation: AttestationGroup[];
}

const DISTRIBUTION_QUERY = gql`
  query GroupByAttestation($by: [AttestationScalarFieldEnum!]!, $where: AttestationWhereInput, $orderBy: [AttestationOrderByWithAggregationInput!]) {
    groupByAttestation(by: $by, where: $where, orderBy: $orderBy) {
      isOffchain
      _count {
        _all
      }
    }
  }
`;

const DonutChart = () => {
  const [data, setData] = useState<ChartDataItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: queryData } = await client.query<QueryResponse>({
          query: DISTRIBUTION_QUERY,
          variables: {
            by: ["isOffchain"],
            where: {
              schemaId: {
                equals: "0xb763e62d940bed6f527dd82418e146a904e62a297b8fa765c9b3e1f0bc6fdd68"
              },
              revoked: {
                equals: false}
            },
            orderBy: [
              {
                _count: {
                  attester: "desc"
                }
              }
            ]
          }
        });

        const chartData = queryData.groupByAttestation.map((item: AttestationGroup) => ({
          name: item.isOffchain ? 'Offchain' : 'Onchain',
          value: item._count._all
        }));

        setData(chartData);
      } catch (err) {
        console.error('Error fetching distribution data:', err);
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Use the same gradient colors as the rest of the UI
  const COLORS = ['#3B82F6', '#EC4899'];

  if (loading) return (
    <div className="mt-12 max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.05)]">
      <h3 className="text-xl font-bold text-gray-900 mb-4">Attestation Distribution</h3>
      <div className="h-64 flex items-center justify-center">
        <span className="text-gray-500">Loading...</span>
      </div>
    </div>
  );

  if (error) return (
    <div className="mt-12 max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.05)]">
      <h3 className="text-xl font-bold text-gray-900 mb-4">Attestation Distribution</h3>
      <div className="h-64 flex items-center justify-center">
        <span className="text-red-500">Error loading data: {error}</span>
      </div>
    </div>
  );

  return (
    <div className="mt-12 max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.05)]">
      <h3 className="text-xl font-bold text-gray-900 mb-4">Attestation Distribution</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip 
              formatter={(value: number) => new Intl.NumberFormat().format(value)}
              contentStyle={{ 
                backgroundColor: 'white',
                border: 'none',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
              }}
            />
            <Legend 
              verticalAlign="bottom" 
              height={36}
              formatter={(value: string, entry) => {
                // Define proper type for recharts entry object
                const payload = entry && entry.payload ? entry.payload : { value: 0 };
                const count = payload.value || 0;
                return `${value} (${new Intl.NumberFormat().format(count)})`;
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default DonutChart;