
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';
import { TrendingUp, TrendingDown, DollarSign, Target, AlertTriangle, CheckCircle, Zap, Cloud, Cpu, Database, Users, Calendar, Activity } from 'lucide-react';
import TableChart from './TableChart';
import { detectTablesInText } from '@/utils/tableDetector';

interface DashboardData {
  cards: InsightCard[];
  charts: ChartData[];
  recommendations: Recommendation[];
  callouts: Callout[];
  tables: any[];
  remainingText?: string;
}

interface InsightCard {
  title: string;
  value: string;
  change?: string;
  trend?: 'up' | 'down' | 'neutral';
  icon: string;
  color: string;
  category?: string;
}

interface ChartData {
  type: 'bar' | 'line' | 'pie' | 'area';
  title: string;
  data: any[];
  xAxis: string;
  yAxis: string[];
  description?: string;
}

interface Recommendation {
  text: string;
  priority: 'high' | 'medium' | 'low';
  savings?: string;
  category?: string;
}

interface Callout {
  type: 'warning' | 'success' | 'info';
  title: string;
  description: string;
}

const iconMap: { [key: string]: any } = {
  'dollar': DollarSign,
  'trending-up': TrendingUp,
  'trending-down': TrendingDown,
  'target': Target,
  'cloud': Cloud,
  'cpu': Cpu,
  'database': Database,
  'zap': Zap,
  'users': Users,
  'calendar': Calendar,
  'activity': Activity,
};

const CHART_COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7c7c', '#8dd1e1', '#d084d0', '#ffb347'];

const DashboardRenderer = ({ content }: { content: string }) => {
  const dashboardData = parseDashboardContent(content);

  if (!dashboardData || (dashboardData.cards.length === 0 && dashboardData.charts.length === 0 && dashboardData.recommendations.length === 0 && dashboardData.callouts.length === 0 && dashboardData.tables.length === 0)) {
    return (
      <div className="prose max-w-none">
        <p className="text-sm leading-relaxed whitespace-pre-wrap">{content}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Key Metrics Dashboard */}
      {dashboardData.cards.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <Activity className="h-5 w-5 mr-2 text-blue-600" />
            Key Metrics
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {dashboardData.cards.map((card, index) => {
              const IconComponent = iconMap[card.icon] || DollarSign;
              return (
                <Card key={index} className="bg-gradient-to-br from-white to-gray-50 hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="text-xs font-medium text-gray-600 uppercase tracking-wide">{card.title}</p>
                        <p className="text-2xl font-bold text-gray-900 mt-1">{card.value}</p>
                        {card.change && (
                          <div className={`flex items-center mt-2 text-sm ${
                            card.trend === 'up' ? 'text-green-600' : 
                            card.trend === 'down' ? 'text-red-600' : 'text-gray-600'
                          }`}>
                            {card.trend === 'up' && <TrendingUp className="h-3 w-3 mr-1" />}
                            {card.trend === 'down' && <TrendingDown className="h-3 w-3 mr-1" />}
                            <span className="font-medium">{card.change}</span>
                          </div>
                        )}
                      </div>
                      <div className={`p-3 rounded-xl ${card.color} flex-shrink-0`}>
                        <IconComponent className="h-6 w-6 text-white" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* Charts Section */}
      {dashboardData.charts.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <BarChart className="h-5 w-5 mr-2 text-purple-600" />
            Analytics & Trends
          </h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {dashboardData.charts.map((chart, index) => (
              <Card key={index} className="bg-white">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">{chart.title}</CardTitle>
                  {chart.description && (
                    <p className="text-sm text-gray-600">{chart.description}</p>
                  )}
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    {chart.type === 'bar' ? (
                      <BarChart data={chart.data}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey={chart.xAxis} />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        {chart.yAxis.map((axis, i) => (
                          <Bar key={axis} dataKey={axis} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                        ))}
                      </BarChart>
                    ) : chart.type === 'line' ? (
                      <LineChart data={chart.data}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey={chart.xAxis} />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        {chart.yAxis.map((axis, i) => (
                          <Line key={axis} type="monotone" dataKey={axis} stroke={CHART_COLORS[i % CHART_COLORS.length]} strokeWidth={2} />
                        ))}
                      </LineChart>
                    ) : chart.type === 'area' ? (
                      <AreaChart data={chart.data}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey={chart.xAxis} />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        {chart.yAxis.map((axis, i) => (
                          <Area key={axis} type="monotone" dataKey={axis} stackId="1" stroke={CHART_COLORS[i % CHART_COLORS.length]} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                        ))}
                      </AreaChart>
                    ) : (
                      <PieChart>
                        <Pie
                          data={chart.data}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(1)}%`}
                          outerRadius={100}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {chart.data.map((entry, i) => (
                            <Cell key={`cell-${i}`} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    )}
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Tables Section */}
      {dashboardData.tables.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <Database className="h-5 w-5 mr-2 text-green-600" />
            Data Tables
          </h3>
          <div className="space-y-4 mb-6">
            {dashboardData.tables.map((table, index) => (
              <TableChart key={index} table={table} index={index} />
            ))}
          </div>
        </div>
      )}

      {/* Callouts */}
      {dashboardData.callouts.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {dashboardData.callouts.map((callout, index) => (
            <Card key={index} className={`border-l-4 ${
              callout.type === 'warning' ? 'border-l-yellow-500 bg-yellow-50' :
              callout.type === 'success' ? 'border-l-green-500 bg-green-50' :
              'border-l-blue-500 bg-blue-50'
            }`}>
              <CardContent className="p-4">
                <div className="flex items-start space-x-3">
                  {callout.type === 'warning' && <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />}
                  {callout.type === 'success' && <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />}
                  {callout.type === 'info' && <Target className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />}
                  <div>
                    <h4 className="font-semibold text-gray-900">{callout.title}</h4>
                    <p className="text-sm text-gray-600 mt-1">{callout.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Recommendations */}
      {dashboardData.recommendations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center">
              <Target className="h-5 w-5 mr-2" />
              Actionable Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {dashboardData.recommendations.map((rec, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg border">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm text-gray-900 font-medium">{rec.text}</p>
                    <div className="flex items-center space-x-2 mt-2">
                      <Badge variant={
                        rec.priority === 'high' ? 'destructive' :
                        rec.priority === 'medium' ? 'default' : 'secondary'
                      } className="text-xs">
                        {rec.priority} priority
                      </Badge>
                      {rec.savings && (
                        <Badge variant="outline" className="text-green-600 text-xs">
                          {rec.savings} savings
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Additional Context */}
      {dashboardData.remainingText && (
        <Card className="bg-gray-50 border-l-4 border-l-gray-400">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-medium text-gray-900 flex items-center">
              <Target className="h-4 w-4 mr-2" />
              Additional Context
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="prose max-w-none">
              <p className="text-sm leading-relaxed whitespace-pre-wrap text-gray-700">
                {dashboardData.remainingText}
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

const parseDashboardContent = (content: string): (DashboardData & { remainingText?: string }) | null => {
  const cards: InsightCard[] = [];
  const charts: ChartData[] = [];
  const recommendations: Recommendation[] = [];
  const callouts: Callout[] = [];
  
  // Detect tables using existing utility
  const tables = detectTablesInText(content);

  const lines = content.split('\n');
  const usedLineIndices = new Set<number>();

  // Parse insight cards (look for emoji patterns)
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    // Parse insight cards
    if (line.match(/^[🟦💸🚀📊💰⚡🔥📈📉🎯⭐👥📅💡⚙️🏢]/)) {
      const parts = line.split(':');
      if (parts.length >= 2) {
        const title = parts[0].replace(/^[🟦💸🚀📊💰⚡🔥📈📉🎯⭐👥📅💡⚙️🏢]\s*/, '').trim();
        const value = parts.slice(1).join(':').trim();
        
        let trend: 'up' | 'down' | 'neutral' = 'neutral';
        let change = '';
        
        const changeMatch = value.match(/\(([^)]+)\)/);
        if (changeMatch) {
          change = changeMatch[1];
          trend = change.includes('↑') || change.includes('+') || change.toLowerCase().includes('increase') ? 'up' : 
                 change.includes('↓') || change.includes('-') || change.toLowerCase().includes('decrease') ? 'down' : 'neutral';
        }
        
        cards.push({
          title,
          value: value.replace(/\([^)]+\)/, '').trim(),
          change,
          trend,
          icon: getIconForTitle(title),
          color: getColorForTitle(title)
        });
        
        usedLineIndices.add(i);
      }
    }

    // Parse chart suggestions with enhanced detection
    if (line.toLowerCase().includes('chart:') || line.toLowerCase().includes('graph:') || 
        line.toLowerCase().includes('pie chart') || line.toLowerCase().includes('bar chart') ||
        line.toLowerCase().includes('line chart') || line.toLowerCase().includes('area chart')) {
      
      let chartTitle = line.replace(/^.*?chart:\s*/i, '').replace(/^.*?graph:\s*/i, '').trim();
      let chartType: 'bar' | 'line' | 'pie' | 'area' = 'bar';
      
      if (line.toLowerCase().includes('pie')) chartType = 'pie';
      else if (line.toLowerCase().includes('line')) chartType = 'line';
      else if (line.toLowerCase().includes('area')) chartType = 'area';
      
      // Generate sample data based on context
      const sampleData = generateSampleChartData(chartTitle, chartType);
      
      charts.push({
        type: chartType,
        title: chartTitle || `${chartType.charAt(0).toUpperCase() + chartType.slice(1)} Chart`,
        data: sampleData,
        xAxis: 'name',
        yAxis: chartType === 'pie' ? ['value'] : ['value', 'target'],
        description: `Visual representation of ${chartTitle.toLowerCase()}`
      });
      
      usedLineIndices.add(i);
    }

    // Parse recommendations
    if (line.match(/^[✅✓•-]\s/)) {
      const text = line.replace(/^[✅✓•-]\s*/, '').trim();
      const priority = text.toLowerCase().includes('critical') || text.toLowerCase().includes('urgent') ? 'high' :
                      text.toLowerCase().includes('important') ? 'medium' : 'low';
      
      const savingsMatch = text.match(/\$[\d,]+|\d+%/);
      const savings = savingsMatch ? savingsMatch[0] : undefined;
      
      recommendations.push({
        text: text.replace(/\([^)]*savings[^)]*\)/i, '').trim(),
        priority,
        savings
      });
      
      usedLineIndices.add(i);
    }

    // Parse callouts
    if (line.match(/^[⚠️🚨✅🎉📢💡]/)) {
      const type = line.startsWith('⚠️') || line.startsWith('🚨') ? 'warning' :
                   line.startsWith('✅') || line.startsWith('🎉') ? 'success' : 'info';
      
      const title = line.replace(/^[⚠️🚨✅🎉📢💡]\s*/, '').trim();
      let description = '';
      
      if (i + 1 < lines.length && !lines[i + 1].match(/^[🟦💸🚀📊💰⚡🔥📈📉🎯⭐✅✓•-⚠️🚨🎉📢💡👥📅⚙️🏢]/)) {
        description = lines[i + 1].trim();
        usedLineIndices.add(i + 1);
      }
      
      callouts.push({ type, title, description });
      usedLineIndices.add(i);
    }
  }

  // Collect remaining text that wasn't used for structured components
  const remainingLines = lines.filter((_, index) => !usedLineIndices.has(index) && lines[index].trim().length > 0);
  const remainingText = remainingLines.join('\n').trim();

  return { 
    cards, 
    charts, 
    recommendations, 
    callouts,
    tables,
    remainingText: remainingText.length > 0 ? remainingText : undefined
  };
};

const generateSampleChartData = (title: string, type: string) => {
  const lowerTitle = title.toLowerCase();
  
  if (lowerTitle.includes('cost') || lowerTitle.includes('spend')) {
    return [
      { name: 'Jan', value: 4000, target: 3500 },
      { name: 'Feb', value: 3000, target: 3200 },
      { name: 'Mar', value: 2000, target: 2800 },
      { name: 'Apr', value: 2780, target: 2600 },
      { name: 'May', value: 1890, target: 2400 },
      { name: 'Jun', value: 2390, target: 2200 }
    ];
  } else if (lowerTitle.includes('service') || lowerTitle.includes('provider')) {
    return [
      { name: 'AWS', value: 45, target: 40 },
      { name: 'Azure', value: 30, target: 35 },
      { name: 'GCP', value: 15, target: 20 },
      { name: 'Others', value: 10, target: 5 }
    ];
  } else {
    return [
      { name: 'A', value: 400, target: 350 },
      { name: 'B', value: 300, target: 320 },
      { name: 'C', value: 200, target: 280 },
      { name: 'D', value: 278, target: 260 }
    ];
  }
};

const getIconForTitle = (title: string): string => {
  const lower = title.toLowerCase();
  if (lower.includes('cost') || lower.includes('spend') || lower.includes('price')) return 'dollar';
  if (lower.includes('savings') || lower.includes('optimization')) return 'trending-down';
  if (lower.includes('growth') || lower.includes('increase')) return 'trending-up';
  if (lower.includes('target') || lower.includes('goal')) return 'target';
  if (lower.includes('cloud') || lower.includes('provider')) return 'cloud';
  if (lower.includes('cpu') || lower.includes('compute')) return 'cpu';
  if (lower.includes('database') || lower.includes('storage')) return 'database';
  if (lower.includes('performance') || lower.includes('speed')) return 'zap';
  if (lower.includes('user') || lower.includes('team')) return 'users';
  if (lower.includes('time') || lower.includes('date')) return 'calendar';
  return 'activity';
};

const getColorForTitle = (title: string): string => {
  const lower = title.toLowerCase();
  if (lower.includes('cost') || lower.includes('spend')) return 'bg-red-500';
  if (lower.includes('savings')) return 'bg-green-500';
  if (lower.includes('cloud')) return 'bg-blue-500';
  if (lower.includes('performance')) return 'bg-purple-500';
  if (lower.includes('user')) return 'bg-indigo-500';
  return 'bg-gray-500';
};

export default DashboardRenderer;
