import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Heart, 
  Activity, 
  TrendingUp, 
  User, 
  Calendar,
  ArrowRight,
  Plus,
  AlertTriangle,
  CheckCircle,
  Clock
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { format } from 'date-fns';

interface HealthMetrics {
  heartRate: number;
  spo2: number;
  lactate: number;
  bmi: number;
  riskScore: number;
  lastReading: string;
}

const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [metrics, setMetrics] = useState<HealthMetrics>({
    heartRate: 72,
    spo2: 98,
    lactate: 1.2,
    bmi: 24.5,
    riskScore: 25,
    lastReading: new Date().toISOString()
  });

  const quickActions = [
    {
      title: 'Add Health Reading',
      description: 'Record new vital signs',
      icon: <Plus className="w-6 h-6" />,
      link: '/analytics',
      color: 'bg-primary-500'
    },
    {
      title: 'Update Profile',
      description: 'Modify lifestyle information',
      icon: <User className="w-6 h-6" />,
      link: '/profile',
      color: 'bg-secondary-500'
    },
    {
      title: 'View Analytics',
      description: 'Detailed health insights',
      icon: <TrendingUp className="w-6 h-6" />,
      link: '/analytics',
      color: 'bg-accent-500'
    }
  ];

  const recentActivities = [
    {
      type: 'reading',
      message: 'Heart rate reading recorded',
      time: '2 hours ago',
      status: 'success'
    },
    {
      type: 'profile',
      message: 'Profile updated with new lifestyle data',
      time: '1 day ago',
      status: 'info'
    },
    {
      type: 'alert',
      message: 'SpO2 levels below normal range',
      time: '3 days ago',
      status: 'warning'
    }
  ];

  const getStatusColor = (metric: string, value: number) => {
    switch (metric) {
      case 'heartRate':
        return value < 60 ? 'text-blue-600' : value > 100 ? 'text-red-600' : 'text-green-600';
      case 'spo2':
        return value < 95 ? 'text-red-600' : 'text-green-600';
      case 'lactate':
        return value > 2 ? 'text-red-600' : value > 1.5 ? 'text-yellow-600' : 'text-green-600';
      case 'bmi':
        return value < 18.5 ? 'text-blue-600' : value > 25 ? 'text-yellow-600' : 'text-green-600';
      default:
        return 'text-gray-600';
    }
  };

  const getRiskLevel = (score: number) => {
    if (score < 30) return { level: 'Low', color: 'text-green-600', bg: 'bg-green-50' };
    if (score < 60) return { level: 'Medium', color: 'text-yellow-600', bg: 'bg-yellow-50' };
    return { level: 'High', color: 'text-red-600', bg: 'bg-red-50' };
  };

  const riskLevel = getRiskLevel(metrics.riskScore);

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
              <h1 className="text-3xl font-bold text-text-primary">
                Welcome back, {user?.firstName}!
              </h1>
              <p className="text-text-secondary mt-1">
                Here's your health overview for {format(new Date(), 'EEEE, MMMM d, yyyy')}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <div className="text-sm text-text-secondary">Last updated</div>
                <div className="text-sm font-medium text-text-primary">
                  {format(new Date(metrics.lastReading), 'MMM d, h:mm a')}
                </div>
              </div>
              <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
                <Heart className="w-6 h-6 text-primary-600" />
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Health Metrics Overview */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="card"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-text-primary">Health Metrics</h2>
                <Link to="/analytics" className="text-primary-600 hover:text-primary-700 font-medium flex items-center">
                  View Details
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Link>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className={`text-2xl font-bold ${getStatusColor('heartRate', metrics.heartRate)}`}>
                    {metrics.heartRate}
                  </div>
                  <div className="text-sm text-text-secondary">BPM</div>
                  <div className="text-xs text-text-muted">Heart Rate</div>
                </div>
                <div className="text-center">
                  <div className={`text-2xl font-bold ${getStatusColor('spo2', metrics.spo2)}`}>
                    {metrics.spo2}%
                  </div>
                  <div className="text-sm text-text-secondary">SpO2</div>
                  <div className="text-xs text-text-muted">Blood Oxygen</div>
                </div>
                <div className="text-center">
                  <div className={`text-2xl font-bold ${getStatusColor('lactate', metrics.lactate)}`}>
                    {metrics.lactate}
                  </div>
                  <div className="text-sm text-text-secondary">mmol/L</div>
                  <div className="text-xs text-text-muted">Lactate</div>
                </div>
                <div className="text-center">
                  <div className={`text-2xl font-bold ${getStatusColor('bmi', metrics.bmi)}`}>
                    {metrics.bmi}
                  </div>
                  <div className="text-sm text-text-secondary">BMI</div>
                  <div className="text-xs text-text-muted">Body Mass Index</div>
                </div>
              </div>
            </motion.div>

            {/* Risk Assessment */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="card"
            >
              <h2 className="text-xl font-semibold text-text-primary mb-6">Health Risk Assessment</h2>
              <div className="flex items-center justify-between">
                <div>
                  <div className={`text-2xl font-bold ${riskLevel.color}`}>
                    {riskLevel.level} Risk
                  </div>
                  <div className="text-text-secondary mt-1">
                    Risk Score: {metrics.riskScore}/100
                  </div>
                  <div className="text-sm text-text-muted mt-2">
                    Based on your lifestyle and health data
                  </div>
                </div>
                <div className={`w-20 h-20 rounded-full ${riskLevel.bg} flex items-center justify-center`}>
                  <div className={`text-3xl font-bold ${riskLevel.color}`}>
                    {metrics.riskScore}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="card"
            >
              <h2 className="text-xl font-semibold text-text-primary mb-6">Quick Actions</h2>
              <div className="grid md:grid-cols-3 gap-4">
                {quickActions.map((action, index) => (
                  <Link
                    key={action.title}
                    to={action.link}
                    className="card-hover p-4 text-center group"
                  >
                    <div className={`w-12 h-12 ${action.color} rounded-xl flex items-center justify-center mx-auto mb-3 text-white`}>
                      {action.icon}
                    </div>
                    <h3 className="font-semibold text-text-primary group-hover:text-primary-600 transition-colors">
                      {action.title}
                    </h3>
                    <p className="text-sm text-text-secondary mt-1">
                      {action.description}
                    </p>
                  </Link>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Recent Activity */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="card"
            >
              <h2 className="text-xl font-semibold text-text-primary mb-6">Recent Activity</h2>
              <div className="space-y-4">
                {recentActivities.map((activity, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="flex-shrink-0 mt-1">
                      {activity.status === 'success' && <CheckCircle className="w-4 h-4 text-green-600" />}
                      {activity.status === 'warning' && <AlertTriangle className="w-4 h-4 text-yellow-600" />}
                      {activity.status === 'info' && <Clock className="w-4 h-4 text-blue-600" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-text-primary">{activity.message}</p>
                      <p className="text-xs text-text-muted mt-1">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Health Tips */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="card bg-gradient-to-br from-primary-50 to-secondary-50"
            >
              <h2 className="text-xl font-semibold text-text-primary mb-4">Health Tip</h2>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Heart className="w-4 h-4 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-text-primary">Stay Hydrated</h3>
                    <p className="text-sm text-text-secondary mt-1">
                      Drinking adequate water helps maintain optimal heart rate and blood pressure levels.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Upcoming Reminders */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
              className="card"
            >
              <h2 className="text-xl font-semibold text-text-primary mb-6">Upcoming</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                  <div>
                    <div className="font-medium text-text-primary">Next Reading</div>
                    <div className="text-sm text-text-secondary">Due in 2 hours</div>
                  </div>
                  <Calendar className="w-5 h-5 text-yellow-600" />
                </div>
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <div>
                    <div className="font-medium text-text-primary">Profile Review</div>
                    <div className="text-sm text-text-secondary">Due in 3 days</div>
                  </div>
                  <User className="w-5 h-5 text-blue-600" />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
