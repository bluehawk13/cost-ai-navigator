import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from "@/components/ui/badge";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart } from 'recharts';
import { Table } from 'lucide-react';
import {
    Table as UiTable,
    TableHeader,
    TableRow,
    TableHead,
    TableBody,
    TableCell,
  } from '@/components/ui/table';
  
  import { Pie, Cell } from 'recharts';
  
  import { CheckCircle } from 'lucide-react';
  


interface DashboardRendererProps {
    content: {
      summaryCards?: Array<{
        title: string;
        value: React.ReactNode;
        description?: string;
        status?: 'positive' | 'negative' | 'neutral';
      }>;
      tables?: Array<{
        title?: string;
        headers: string[];
        rows: any[][];
      }>;
      charts?: Array<{
        type?: 'bar' | 'line' | 'pie';
        title?: string;
        data: {
          labels: string[];
          values: number[];
        };
      }>;
      alerts?: string[];
      recommendations?: string[];
    };
  }
  
  const DashboardRenderer: React.FC<DashboardRendererProps> = ({ content }) => {
    const transformChartData = (chartData: { labels: string[]; values: number[] }) => {
        return chartData.labels.map((label, index) => ({
          name: label,
          value: chartData.values[index]
        }));
      };
      
      // Color palette for charts
      const COLORS = [
        '#0088FE', '#00C49F', '#FFBB28', '#FF8042', 
        '#A4DE6C', '#D0ED57', '#8884D8', '#82CA9D'
      ];

    return (
      <div className="space-y-6">
        {/* Summary Cards Section */}
        {content.summaryCards && content.summaryCards.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {content.summaryCards.map((card, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {card.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{card.value}</div>
                  {card.description && (
                    <p className="text-xs text-muted-foreground mt-1">
                      {card.description}
                    </p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
  
        {/* Charts Section */}
        {content.charts?.map((chart, index) => (
          <Card key={`chart-${index}`} className="mt-4">
            <CardHeader>
              <CardTitle>{chart.title || 'Data Visualization'}</CardTitle>
            </CardHeader>
            <CardContent className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                {chart.type === 'pie' ? (
                  <PieChart>
                    <Pie data={transformChartData(chart.data)} dataKey="value">
                      {chart.data.labels.map((_, i) => (
                        <Cell key={`cell-${i}`} fill={COLORS[i % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                ) : (
                  <BarChart data={transformChartData(chart.data)}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" fill="#8884d8" />
                  </BarChart>
                )}
              </ResponsiveContainer>
            </CardContent>
          </Card>
        ))}
  
        {/* Tables Section */}
        {content.tables?.map((table, index) => (
          <div key={`table-${index}`} className="mt-4">
            {table.title && <h3 className="text-lg font-semibold mb-2">{table.title}</h3>}
            <div className="border rounded-lg overflow-hidden">
            <UiTable>
                <TableHeader>
                  <TableRow>
                    {table.headers.map((header, i) => (
                      <TableHead key={`header-${i}`}>{header}</TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {table.rows.map((row, rowIndex) => (
                    <TableRow key={`row-${rowIndex}`}>
                      {row.map((cell, cellIndex) => (
                        <TableCell key={`cell-${cellIndex}`}>{cell}</TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </UiTable>
            </div>
          </div>
        ))}
  
        {/* Alerts Section */}
        {content.alerts?.length > 0 && (
          <div className="space-y-2 mt-4">
            {content.alerts.map((alert, index) => (
              <Alert 
                key={`alert-${index}`}
                variant={alert.startsWith('⚠️') ? 'destructive' : 'default'}
              >
                {alert.replace(/[⚠️✅]/g, '').trim()}
              </Alert>
            ))}
          </div>
        )}
  
        {/* Recommendations Section */}
        {content.recommendations?.length > 0 && (
          <Card className="mt-4">
            <CardHeader>
              <CardTitle>Recommendations</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {content.recommendations.map((rec, index) => (
                  <li key={`rec-${index}`} className="flex items-start">
                    <CheckCircle className="h-4 w-4 mt-1 mr-2 text-green-500" />
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}
      </div>
    );
  };

  export default  DashboardRenderer;