import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  User, 
  Activity, 
  Heart, 
  Save, 
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  Scale
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

interface ProfileData {
  height: number;
  weight: number;
  age: number;
  bmi: number;
  smokingStatus: 'never' | 'former' | 'current';
  alcoholConsumption: 'none' | 'moderate' | 'heavy';
  activityLevel: 'sedentary' | 'moderate' | 'active';
  hasHypertension: boolean;
  hasDiabetes: boolean;
  hasHighBP: boolean;
  familyHistory: {
    heartDisease: boolean;
    diabetes: boolean;
    hypertension: boolean;
  };
  healthRiskScore: number;
  predictedRisk: 'low' | 'medium' | 'high';
}

const ProfilePage: React.FC = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [profileData, setProfileData] = useState<ProfileData>({
    height: 170,
    weight: 70,
    age: user?.age || 30,
    bmi: 24.2,
    smokingStatus: 'never',
    alcoholConsumption: 'none',
    activityLevel: 'moderate',
    hasHypertension: false,
    hasDiabetes: false,
    hasHighBP: false,
    familyHistory: {
      heartDisease: false,
      diabetes: false,
      hypertension: false
    },
    healthRiskScore: 25,
    predictedRisk: 'low'
  });

  // Calculate BMI when height or weight changes
  useEffect(() => {
    const heightInMeters = profileData.height / 100;
    const bmi = Number((profileData.weight / (heightInMeters * heightInMeters)).toFixed(1));
    setProfileData(prev => ({ ...prev, bmi }));
  }, [profileData.height, profileData.weight]);

  const getBMICategory = (bmi: number) => {
    if (bmi < 18.5) return { category: 'Underweight', color: 'text-blue-600', bg: 'bg-blue-50' };
    if (bmi < 25) return { category: 'Normal', color: 'text-green-600', bg: 'bg-green-50' };
    if (bmi < 30) return { category: 'Overweight', color: 'text-yellow-600', bg: 'bg-yellow-50' };
    return { category: 'Obese', color: 'text-red-600', bg: 'bg-red-50' };
  };

  const getRiskLevel = (score: number) => {
    if (score < 30) return { level: 'Low', color: 'text-green-600', bg: 'bg-green-50' };
    if (score < 60) return { level: 'Medium', color: 'text-yellow-600', bg: 'bg-yellow-50' };
    return { level: 'High', color: 'text-red-600', bg: 'bg-red-50' };
  };

  const handleInputChange = (field: string, value: any) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleFamilyHistoryChange = (field: string, value: boolean) => {
    setProfileData(prev => ({
      ...prev,
      familyHistory: {
        ...prev.familyHistory,
        [field]: value
      }
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Calculate risk score (simplified version)
      let riskScore = 0;
      if (profileData.age > 65) riskScore += 20;
      else if (profileData.age > 45) riskScore += 15;
      else if (profileData.age > 35) riskScore += 10;

      if (profileData.bmi >= 30) riskScore += 25;
      else if (profileData.bmi >= 25) riskScore += 15;
      else if (profileData.bmi < 18.5) riskScore += 10;

      if (profileData.smokingStatus === 'current') riskScore += 20;
      else if (profileData.smokingStatus === 'former') riskScore += 10;

      if (profileData.alcoholConsumption === 'heavy') riskScore += 15;
      else if (profileData.alcoholConsumption === 'moderate') riskScore += 5;

      if (profileData.activityLevel === 'sedentary') riskScore += 15;
      else if (profileData.activityLevel === 'moderate') riskScore += 5;

      if (profileData.hasHypertension) riskScore += 20;
      if (profileData.hasDiabetes) riskScore += 25;
      if (profileData.hasHighBP) riskScore += 15;

      if (profileData.familyHistory.heartDisease) riskScore += 10;
      if (profileData.familyHistory.diabetes) riskScore += 10;
      if (profileData.familyHistory.hypertension) riskScore += 8;

      const predictedRisk = riskScore < 30 ? 'low' : riskScore < 60 ? 'medium' : 'high';

      setProfileData(prev => ({
        ...prev,
        healthRiskScore: Math.min(riskScore, 100),
        predictedRisk
      }));

      toast.success('Profile updated successfully!');
    } catch (error) {
      toast.error('Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const bmiCategory = getBMICategory(profileData.bmi);
  const riskLevel = getRiskLevel(profileData.healthRiskScore);

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
              <h1 className="text-3xl font-bold text-text-primary">Health Profile</h1>
              <p className="text-text-secondary mt-1">
                Manage your lifestyle information and health preferences
              </p>
            </div>
            <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
              <User className="w-6 h-6 text-primary-600" />
            </div>
          </motion.div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="card"
          >
            <h2 className="text-xl font-semibold text-text-primary mb-6">Basic Information</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Height (cm)
                </label>
                <input
                  type="number"
                  value={profileData.height}
                  onChange={(e) => handleInputChange('height', Number(e.target.value))}
                  className="input-field"
                  min="100"
                  max="250"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Weight (kg)
                </label>
                <input
                  type="number"
                  value={profileData.weight}
                  onChange={(e) => handleInputChange('weight', Number(e.target.value))}
                  className="input-field"
                  min="20"
                  max="300"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Age
                </label>
                <input
                  type="number"
                  value={profileData.age}
                  onChange={(e) => handleInputChange('age', Number(e.target.value))}
                  className="input-field"
                  min="1"
                  max="120"
                  required
                />
              </div>
            </div>

            {/* BMI Display */}
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Scale className="w-5 h-5 text-primary-600" />
                  <div>
                    <div className="text-sm font-medium text-text-primary">BMI</div>
                    <div className="text-2xl font-bold text-text-primary">{profileData.bmi}</div>
                  </div>
                </div>
                <div className={`px-3 py-1 rounded-full text-sm font-medium ${bmiCategory.bg} ${bmiCategory.color}`}>
                  {bmiCategory.category}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Lifestyle Factors */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="card"
          >
            <h2 className="text-xl font-semibold text-text-primary mb-6">Lifestyle Factors</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Smoking Status
                </label>
                <select
                  value={profileData.smokingStatus}
                  onChange={(e) => handleInputChange('smokingStatus', e.target.value)}
                  className="input-field"
                >
                  <option value="never">Never</option>
                  <option value="former">Former</option>
                  <option value="current">Current</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Alcohol Consumption
                </label>
                <select
                  value={profileData.alcoholConsumption}
                  onChange={(e) => handleInputChange('alcoholConsumption', e.target.value)}
                  className="input-field"
                >
                  <option value="none">None</option>
                  <option value="moderate">Moderate</option>
                  <option value="heavy">Heavy</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Activity Level
                </label>
                <select
                  value={profileData.activityLevel}
                  onChange={(e) => handleInputChange('activityLevel', e.target.value)}
                  className="input-field"
                >
                  <option value="sedentary">Sedentary</option>
                  <option value="moderate">Moderate</option>
                  <option value="active">Active</option>
                </select>
              </div>
            </div>
          </motion.div>

          {/* Medical Conditions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="card"
          >
            <h2 className="text-xl font-semibold text-text-primary mb-6">Medical Conditions</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={profileData.hasHypertension}
                  onChange={(e) => handleInputChange('hasHypertension', e.target.checked)}
                  className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                />
                <span className="text-sm text-text-primary">Hypertension</span>
              </label>
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={profileData.hasDiabetes}
                  onChange={(e) => handleInputChange('hasDiabetes', e.target.checked)}
                  className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                />
                <span className="text-sm text-text-primary">Diabetes</span>
              </label>
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={profileData.hasHighBP}
                  onChange={(e) => handleInputChange('hasHighBP', e.target.checked)}
                  className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                />
                <span className="text-sm text-text-primary">High Blood Pressure</span>
              </label>
            </div>
          </motion.div>

          {/* Family History */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="card"
          >
            <h2 className="text-xl font-semibold text-text-primary mb-6">Family History</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={profileData.familyHistory.heartDisease}
                  onChange={(e) => handleFamilyHistoryChange('heartDisease', e.target.checked)}
                  className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                />
                <span className="text-sm text-text-primary">Heart Disease</span>
              </label>
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={profileData.familyHistory.diabetes}
                  onChange={(e) => handleFamilyHistoryChange('diabetes', e.target.checked)}
                  className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                />
                <span className="text-sm text-text-primary">Diabetes</span>
              </label>
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={profileData.familyHistory.hypertension}
                  onChange={(e) => handleFamilyHistoryChange('hypertension', e.target.checked)}
                  className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                />
                <span className="text-sm text-text-primary">Hypertension</span>
              </label>
            </div>
          </motion.div>

          {/* Health Risk Assessment */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="card"
          >
            <h2 className="text-xl font-semibold text-text-primary mb-6">Health Risk Assessment</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="p-6 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <Heart className="w-6 h-6 text-primary-600" />
                    <div>
                      <div className="text-sm font-medium text-text-primary">Risk Score</div>
                      <div className="text-3xl font-bold text-text-primary">{profileData.healthRiskScore}/100</div>
                    </div>
                  </div>
                  <div className={`px-4 py-2 rounded-full text-sm font-medium ${riskLevel.bg} ${riskLevel.color}`}>
                    {riskLevel.level} Risk
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-300 ${
                      profileData.healthRiskScore < 30 ? 'bg-green-500' :
                      profileData.healthRiskScore < 60 ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${profileData.healthRiskScore}%` }}
                  />
                </div>
              </div>
              <div className="p-6 bg-gradient-to-br from-primary-50 to-secondary-50 rounded-lg">
                <div className="flex items-center space-x-3 mb-4">
                  <TrendingUp className="w-6 h-6 text-primary-600" />
                  <h3 className="text-lg font-semibold text-text-primary">AI Insights</h3>
                </div>
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                    <div>
                      <div className="text-sm font-medium text-text-primary">Good BMI Range</div>
                      <div className="text-xs text-text-secondary">Your BMI is within healthy limits</div>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
                    <div>
                      <div className="text-sm font-medium text-text-primary">Consider Activity</div>
                      <div className="text-xs text-text-secondary">Increase physical activity for better health</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Submit Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex justify-end"
          >
            <button
              type="submit"
              disabled={loading}
              className="btn-primary flex items-center"
            >
              <Save className="w-4 h-4 mr-2" />
              {loading ? 'Saving...' : 'Save Profile'}
            </button>
          </motion.div>
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;
