import { useState } from 'react';
import { 
  Building2, 
  Crown, 
  Users, 
  FileText, 
  TrendingUp,
  AlertCircle,
  CheckCircle
} from 'lucide-react';

const TenantInfo = ({ tenantInfo, user, onUpgrade }) => {
  const [isUpgrading, setIsUpgrading] = useState(false);

  const handleUpgrade = async () => {
    if (window.confirm('Are you sure you want to upgrade to Pro plan? This will give you unlimited notes.')) {
      setIsUpgrading(true);
      try {
        await onUpgrade();
      } finally {
        setIsUpgrading(false);
      }
    }
  };

  if (!tenantInfo) {
    return (
      <div className="card">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
          <div className="h-3 bg-gray-200 rounded w-2/3"></div>
        </div>
      </div>
    );
  }

  const isFreePlan = tenantInfo.subscription?.plan === 'free';
  const isProPlan = tenantInfo.subscription?.plan === 'pro';
  const isAtLimit = !tenantInfo.canCreateMore && isFreePlan;
  const canUpgrade = user?.role === 'admin' && isFreePlan;

  return (
    <div className="space-y-4">
      {/* Tenant Info Card */}
      <div className="card">
        <div className="flex items-center space-x-3 mb-4">
          <div className="p-2 bg-primary-100 rounded-lg">
            <Building2 className="h-6 w-6 text-primary-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{tenantInfo.name}</h3>
            <p className="text-sm text-gray-500">@{tenantInfo.slug}</p>
          </div>
        </div>

        {/* Plan Status */}
        <div className="mb-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">Current Plan</span>
            <div className="flex items-center space-x-2">
              {isProPlan && <Crown className="h-4 w-4 text-yellow-500" />}
              <span className={`text-sm font-semibold capitalize ${
                isProPlan ? 'text-yellow-600' : 'text-gray-600'
              }`}>
                {tenantInfo.subscription?.plan || 'free'}
              </span>
            </div>
          </div>
        </div>

        {/* Usage Stats */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <FileText className="h-4 w-4 text-gray-400" />
              <span className="text-sm text-gray-600">Notes Created</span>
            </div>
            <span className="text-sm font-medium text-gray-900">
              {tenantInfo.noteCount || 0}
              {isFreePlan && ` / ${tenantInfo.subscription?.noteLimit || 3}`}
            </span>
          </div>

          {isFreePlan && (
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                style={{
                  width: `${Math.min(
                    ((tenantInfo.noteCount || 0) / (tenantInfo.subscription?.noteLimit || 3)) * 100,
                    100
                  )}%`
                }}
              ></div>
            </div>
          )}
        </div>

        {/* Status Messages */}
        {isAtLimit && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center space-x-2">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <span className="text-sm text-red-700">
                Free plan limit reached
              </span>
            </div>
          </div>
        )}

        {isProPlan && (
          <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span className="text-sm text-green-700">
                Unlimited notes available
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Upgrade Card */}
      {canUpgrade && (
        <div className="card bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200">
          <div className="text-center">
            <div className="flex justify-center mb-3">
              <div className="p-3 bg-yellow-100 rounded-full">
                <Crown className="h-8 w-8 text-yellow-600" />
              </div>
            </div>
            <h3 className="text-lg font-semibold text-yellow-800 mb-2">
              Upgrade to Pro
            </h3>
            <p className="text-sm text-yellow-700 mb-4">
              Get unlimited notes and advanced features
            </p>
            <button
              onClick={handleUpgrade}
              disabled={isUpgrading}
              className="w-full btn-primary bg-yellow-600 hover:bg-yellow-700 disabled:opacity-50"
            >
              {isUpgrading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Upgrading...</span>
                </div>
              ) : (
                'Upgrade Now'
              )}
            </button>
          </div>
        </div>
      )}

      {/* Features Comparison */}
      <div className="card">
        <h4 className="text-sm font-semibold text-gray-900 mb-3">Plan Features</h4>
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Notes Limit</span>
            <span className="font-medium">
              {isProPlan ? 'Unlimited' : `${tenantInfo.subscription?.noteLimit || 3} notes`}
            </span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">User Management</span>
            <span className="font-medium">
              {user?.role === 'admin' ? 'Available' : 'Admin Only'}
            </span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Priority Support</span>
            <span className="font-medium">
              {isProPlan ? 'Yes' : 'No'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TenantInfo;
