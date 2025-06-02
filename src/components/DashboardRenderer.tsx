
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import { TrendingUp, TrendingDown, DollarSign, Target, AlertTriangle, CheckCircle, Zap, Cloud, Cpu, Database } from 'lucide-react';

interface DashboardData {
  cards: InsightCard[];
  charts: ChartData[];
  recommendations: Recommendation[];
  callouts: Callout[];
}

interface InsightCard {
  title: string;
  value: string;
  change?: string;
  trend?: 'up' | 'down' | 'neutral';
  icon: string;
  color: string;
}

interface ChartData {
  type: 'bar' | 'line';
  title: string;
  data: any[];
  xAxis: string;
  yAxis: string[];
}

interface Recommendation {
  text: string;
  priority: 'high' | 'medium' | 'low';
  savings?: string;
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
};

const DashboardRenderer = ({ content }: { content: string }) => {
  const dashboardData = parseDashboardContent(content);

  if (!dashboardData || (dashboardData.cards.length === 0 && dashboardData.charts.length === 0 && dashboardData.recommendations.length === 0)) {
    return (
      <p className="text-sm leading-relaxed whitespace-pre-wrap">{content}</p>
    );
  }

  return (
    <div className="space-y-6">
      {/* Insight Cards */}
      {dashboardData.cards.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {dashboardData.cards.map((card, index) => {
            const IconComponent = iconMap[card.icon] || DollarSign;
            return (
              <Card key={index} className="bg-gradient-to-br from-white to-gray-50">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">{card.title}</p>
                      <p className="text-2xl font-bold text-gray-900">{card.value}</p>
                      {card.change && (
                        <p className={`text-sm flex items-center ${
                          card.trend === 'up' ? 'text-green-600' : 
                          card.trend === 'down' ? 'text-red-600' : 'text-gray-600'
                        }`}>
                          {card.trend === 'up' && <TrendingUp className="h-3 w-3 mr-1" />}
                          {card.trend === 'down' && <TrendingDown className="h-3 w-3 mr-1" />}
                          {card.change}
                        </p>
                      )}
                    </div>
                    <div className={`p-3 rounded-xl ${card.color}`}>
                      <IconComponent className="h-6 w-6 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Charts */}
      {dashboardData.charts.map((chart, index) => (
        <Card key={index}>
          <CardHeader>
            <CardTitle className="text-lg">{chart.title}</CardTitle>
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
                    <Bar key={axis} dataKey={axis} fill={`hsl(${i * 60}, 70%, 50%)`} />
                  ))}
                </BarChart>
              ) : (
                <LineChart data={chart.data}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey={chart.xAxis} />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  {chart.yAxis.map((axis, i) => (
                    <Line key={axis} type="monotone" dataKey={axis} stroke={`hsl(${i * 60}, 70%, 50%)`} />
                  ))}
                </LineChart>
              )}
            </ResponsiveContainer>
          </CardContent>
        </Card>
      ))}

      {/* Callouts */}
      {dashboardData.callouts.map((callout, index) => (
        <Card key={index} className={`border-l-4 ${
          callout.type === 'warning' ? 'border-l-yellow-500 bg-yellow-50' :
          callout.type === 'success' ? 'border-l-green-500 bg-green-50' :
          'border-l-blue-500 bg-blue-50'
        }`}>
          <CardContent className="p-4">
            <div className="flex items-start space-x-3">
              {callout.type === 'warning' && <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />}
              {callout.type === 'success' && <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />}
              {callout.type === 'info' && <Target className="h-5 w-5 text-blue-600 mt-0.5" />}
              <div>
                <h4 className="font-semibold text-gray-900">{callout.title}</h4>
                <p className="text-sm text-gray-600 mt-1">{callout.description}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}

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
            <div className="space-y-3">
              {dashboardData.recommendations.map((rec, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">{rec.text}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <Badge variant={
                        rec.priority === 'high' ? 'destructive' :
                        rec.priority === 'medium' ? 'default' : 'secondary'
                      }>
                        {rec.priority} priority
                      </Badge>
                      {rec.savings && (
                        <Badge variant="outline" className="text-green-600">
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
    </div>
  );
};

const parseDashboardContent = (content: string): DashboardData | null => {
  const cards: InsightCard[] = [];
  const charts: ChartData[] = [];
  const recommendations: Recommendation[] = [];
  const callouts: Callout[] = [];

  const lines = content.split('\n');

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    // Parse insight cards (look for emoji patterns)
    if (line.match(/^[🟦💸🚀📊💰⚡🔥📈📉🎯⭐]/)) {
      const parts = line.split(':');
      if (parts.length >= 2) {
        const title = parts[0].replace(/^[🟦💸🚀📊💰⚡🔥📈📉🎯⭐]\s*/, '').trim();
        const value = parts.slice(1).join(':').trim();
        
        let trend: 'up' | 'down' | 'neutral' = 'neutral';
        let change = '';
        
        // Extract change/trend info
        const changeMatch = value.match(/\(([^)]+)\)/);
        if (changeMatch) {
          change = changeMatch[1];
          trend = change.includes('↑') || change.includes('+') ? 'up' : 
                 change.includes('↓') || change.includes('-') ? 'down' : 'neutral';
        }
        
        cards.push({
          title,
          value: value.replace(/\([^)]+\)/, '').trim(),
          change,
          trend,
          icon: getIconForTitle(title),
          color: getColorForTitle(title)
        });
      }
    }

    // Parse chart suggestions
    if (line.toLowerCase().includes('chart:') || line.toLowerCase().includes('graph:')) {
      const chartTitle = line.replace(/^.*?chart:\s*/i, '').replace(/^.*?graph:\s*/i, '').trim();
      // For now, create placeholder chart data
      charts.push({
        type: line.toLowerCase().includes('line') ? 'line' : 'bar',
        title: chartTitle,
        data: [],
        xAxis: 'category',
        yAxis: ['value']
      });
    }

    // Parse recommendations (look for checkmarks or bullet points)
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
    }

    // Parse callouts (look for warning/success patterns)
    if (line.match(/^[⚠️🚨✅🎉📢]/)) {
      const type = line.startsWith('⚠️') || line.startsWith('🚨') ? 'warning' :
                   line.startsWith('✅') || line.startsWith('🎉') ? 'success' : 'info';
      
      const title = line.replace(/^[⚠️🚨✅🎉📢]\s*/, '').trim();
      let description = '';
      
      // Look for description in next lines
      if (i + 1 < lines.length && !lines[i + 1].match(/^[🟦💸🚀📊💰⚡🔥📈📉🎯⭐✅✓•-⚠️🚨🎉📢]/)) {
        description = lines[i + 1].trim();
      }
      
      callouts.push({
        type,
        title,
        description
      });
    }
  }

  return { cards, charts, recommendations, callouts };
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
  return 'dollar';
};

const getColorForTitle = (title: string): string => {
  const lower = title.toLowerCase();
  if (lower.includes('cost') || lower.includes('spend')) return 'bg-red-500';
  if (lower.includes('savings')) return 'bg-green-500';
  if (lower.includes('cloud')) return 'bg-blue-500';
  if (lower.includes('performance')) return 'bg-purple-500';
  return 'bg-gray-500';
};

export default DashboardRenderer;
