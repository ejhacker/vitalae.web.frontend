import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  LineChart, 
  Line, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { 
  Heart, 
  Activity, 
  TrendingUp, 
  Calendar,
  Download,
  Filter,
  RefreshCw
} from 'lucide-react';
import { format, subDays, startOfDay } from 'date-fns';

interface HealthData {
  date: string;
  heartRate: number;
  spo2: number;
  lactate: number;
  ecgReadings: number[];
}

const AnalyticsPage: React.FC = () => {
  const [selectedMetric, setSelectedMetric] = useState<'heartRate' | 'spo2' | 'lactate' | 'ecg'>('heartRate');
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('7d');
  const [loading, setLoading] = useState(false);

  // Mock data for demonstration - replace with actual API calls
  const [healthData, setHealthData] = useState<HealthData[]>([
    {
      date: format(subDays(new Date(), 6), 'yyyy-MM-dd'),
      heartRate: 72,
      spo2: 98,
      lactate: 1.2,
      ecgReadings: [0.5, 0.8, 1.2, 0.9, 0.6, 1.1, 0.7, 0.9, 1.3, 0.8]
    },
    {
      date: format(subDays(new Date(), 5), 'yyyy-MM-dd'),
      heartRate: 75,
      spo2: 97,
      lactate: 1.4,
      ecgReadings: [0.6, 0.9, 1.1, 0.8, 0.7, 1.0, 0.8, 1.2, 0.9, 1.1]
    },
    {
      date: format(subDays(new Date(), 4), 'yyyy-MM-dd'),
      heartRate: 68,
      spo2: 99,
      lactate: 1.1,
      ecgReadings: [0.4, 0.7, 1.0, 0.8, 0.5, 0.9, 0.6, 1.1, 0.8, 1.0]
    },
    {
      date: format(subDays(new Date(), 3), 'yyyy-MM-dd'),
      heartRate: 80,
      spo2: 96,
      lactate: 1.6,
      ecgReadings: [0.7, 1.0, 1.3, 0.9, 0.8, 1.2, 0.9, 1.4, 1.0, 1.2]
    },
    {
      date: format(subDays(new Date(), 2), 'yyyy-MM-dd'),
      heartRate: 73,
      spo2: 98,
      lactate: 1.3,
      ecgReadings: [0.5, 0.8, 1.1, 0.7, 0.6, 1.0, 0.8, 1.2, 0.9, 1.1]
    },
    {
      date: format(subDays(new Date(), 1), 'yyyy-MM-dd'),
      heartRate: 77,
      spo2: 97,
      lactate: 1.5,
      ecgReadings: [0.6, 0.9, 1.2, 0.8, 0.7, 1.1, 0.9, 1.3, 1.0, 1.2]
    },
    {
      date: format(new Date(), 'yyyy-MM-dd'),
      heartRate: 71,
      spo2: 99,
      lactate: 1.2,
      ecgReadings: [0.5, 0.8, 1.0, 0.7, 0.6, 0.9, 0.8, 1.1, 0.9, 1.0]
    }
  ]);

  const metrics = [
    { key: 'heartRate', label: 'Heart Rate', unit: 'BPM', color: '#ef4444' },
    { key: 'spo2', label: 'SpO2', unit: '%', color: '#3b82f6' },
    { key: 'lactate', label: 'Lactate', unit: 'mmol/L', color: '#10b981' }
  ];

  const currentMetric = metrics.find(m => m.key === selectedMetric);

  // Calculate statistics
  const stats = {
    average: healthData.reduce((sum, data) => sum + data[selectedMetric], 0) / healthData.length,
    min: Math.min(...healthData.map(data => data[selectedMetric])),
    max: Math.max(...healthData.map(data => data[selectedMetric])),
    trend: healthData[healthData.length - 1][selectedMetric] > healthData[0][selectedMetric] ? 'up' : 'down'
  };

  // ECG data for line chart
  const ecgData = healthData.flatMap((day, dayIndex) =>
    day.ecgReadings.map((reading, readingIndex) => ({
      time: dayIndex * 10 + readingIndex,
      value: reading,
      date: day.date
    }))
  );

  // Risk assessment data
  const riskData = [
    { name: 'Low Risk', value: 60, color: '#10b981' },
    { name: 'Medium Risk', value: 25, color: '#f59e0b' },
    { name: 'High Risk', value: 15, color: '#ef4444' }
  ];

  const handleRefresh = async () => {
    setLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setLoading(false);
  };

  const handleExport = () => {
    const csvContent = "data:text/csv;charset=utf-8," + 
      "Date,Heart Rate,SpO2,Lactate\n" +
      healthData.map(data => 
        `${data.date},${data.heartRate},${data.spo2},${data.lactate}`
      ).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "vitalae_health_data.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between"
          >
            <div>
              <h1 className="text-3xl font-bold text-text-primary">Health Analytics</h1>
              <p className="text-text-secondary mt-1">
                Detailed analysis of your vital signs and health trends
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={handleExport}
                className="btn-outline flex items-center"
              >
                <Download className="w-4 h-4 mr-2" />
                Export Data
              </button>
              <button
                onClick={handleRefresh}
                disabled={loading}
                className="btn-primary flex items-center"
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </button>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Main Chart */}
          <div className="lg:col-span-3 space-y-8">
            {/* Metric Selector */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="card"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-text-primary">
                  {currentMetric?.label} Trends
                </h2>
                <div className="flex items-center space-x-4">
                  <select
                    value={selectedMetric}
                    onChange={(e) => setSelectedMetric(e.target.value as any)}
                    className="input-field w-auto"
                  >
                    {metrics.map(metric => (
                      <option key={metric.key} value={metric.key}>
                        {metric.label}
                      </option>
                    ))}
                  </select>
                  <select
                    value={timeRange}
                    onChange={(e) => setTimeRange(e.target.value as any)}
                    className="input-field w-auto"
                  >
                    <option value="7d">Last 7 days</option>
                    <option value="30d">Last 30 days</option>
                    <option value="90d">Last 90 days</option>
                  </select>
                </div>
              </div>

              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={healthData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                    <XAxis 
                      dataKey="date" 
                      stroke="#6b7280"
                      tickFormatter={(value) => format(new Date(value), 'MMM dd')}
                    />
                    <YAxis stroke="#6b7280" />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: 'white',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px'
                      }}
                      labelFormatter={(value) => format(new Date(value), 'MMM dd, yyyy')}
                    />
                    <Line
                      type="monotone"
                      dataKey={selectedMetric}
                      stroke={currentMetric?.color}
                      strokeWidth={3}
                      dot={{ fill: currentMetric?.color, strokeWidth: 2, r: 4 }}
                      activeDot={{ r: 6, stroke: currentMetric?.color, strokeWidth: 2 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </motion.div>

            {/* ECG Chart */}
            {selectedMetric === 'ecg' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="card"
              >
                <h2 className="text-xl font-semibold text-text-primary mb-6">ECG Readings</h2>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={ecgData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                      <XAxis 
                        dataKey="time" 
                        stroke="#6b7280"
                        tickFormatter={(value) => `Day ${Math.floor(value / 10) + 1}`}
                      />
                      <YAxis stroke="#6b7280" />
                      <Tooltip 
                        contentStyle={{
                          backgroundColor: 'white',
                          border: '1px solid #e5e7eb',
                          borderRadius: '8px'
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey="value"
                        stroke="#8b5cf6"
                        fill="#8b5cf6"
                        fillOpacity={0.3}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </motion.div>
            )}

            {/* Statistics Grid */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="grid md:grid-cols-3 gap-6"
            >
              <div className="card text-center">
                <div className="text-2xl font-bold text-primary-600">
                  {stats.average.toFixed(1)}
                </div>
                <div className="text-sm text-text-secondary">Average</div>
                <div className="text-xs text-text-muted">{currentMetric?.unit}</div>
              </div>
              <div className="card text-center">
                <div className="text-2xl font-bold text-secondary-600">
                  {stats.min.toFixed(1)}
                </div>
                <div className="text-sm text-text-secondary">Minimum</div>
                <div className="text-xs text-text-muted">{currentMetric?.unit}</div>
              </div>
              <div className="card text-center">
                <div className="text-2xl font-bold text-accent-600">
                  {stats.max.toFixed(1)}
                </div>
                <div className="text-sm text-text-secondary">Maximum</div>
                <div className="text-xs text-text-muted">{currentMetric?.unit}</div>
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Risk Assessment */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="card"
            >
              <h2 className="text-xl font-semibold text-text-primary mb-6">Risk Assessment</h2>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={riskData}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {riskData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-2 mt-4">
                {riskData.map((risk, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div 
                        className="w-3 h-3 rounded-full mr-2"
                        style={{ backgroundColor: risk.color }}
                      />
                      <span className="text-sm text-text-primary">{risk.name}</span>
                    </div>
                    <span className="text-sm font-medium text-text-primary">{risk.value}%</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Health Insights */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="card"
            >
              <h2 className="text-xl font-semibold text-text-primary mb-6">Health Insights</h2>
              <div className="space-y-4">
                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-start">
                    <TrendingUp className="w-5 h-5 text-green-600 mt-0.5 mr-3" />
                    <div>
                      <h3 className="font-medium text-green-800">Positive Trend</h3>
                      <p className="text-sm text-green-700 mt-1">
                        Your {currentMetric?.label.toLowerCase()} has been stable over the past week.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-start">
                    <Activity className="w-5 h-5 text-blue-600 mt-0.5 mr-3" />
                    <div>
                      <h3 className="font-medium text-blue-800">Recommendation</h3>
                      <p className="text-sm text-blue-700 mt-1">
                        Consider increasing physical activity to improve cardiovascular health.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="card"
            >
              <h2 className="text-xl font-semibold text-text-primary mb-6">Quick Actions</h2>
              <div className="space-y-3">
                <button className="w-full btn-primary text-sm">
                  Add New Reading
                </button>
                <button className="w-full btn-outline text-sm">
                  Schedule Reminder
                </button>
                <button className="w-full btn-outline text-sm">
                  Share Report
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;
