/* eslint-disable react/no-unescaped-entities */
'use client'

import React, { useEffect, useState } from 'react'
import { formatNumberShort } from '@/app/lib/function';
import { Users, Target, DollarSign, Crown, TrendingUp, Activity, BarChart3, CheckCircle, Clock, XCircle, ArrowDownRight, ArrowUpRight, Globe, MapPin } from 'lucide-react'
import { useAuth } from '@/app/contexts/AuthContext';
import toast from 'react-hot-toast';

// Base interfaces
interface User {
  id: string;
  username: string;
  email: string;
  role: string;
  createdAt: Date | string;
}

interface Prediction {
  id: string;
  homeTeam: string;
  awayTeam: string;
  tip: string;
  result: string;
  createdAt: Date | string;
}

interface Payment {
  id: string;
  amount: number;
  status: string;
  createdAt: Date | string;
}

// Component props interfaces
interface StatCardProps {
  icon: React.ComponentType<{ size?: number }>;
  title: string;
  value: string;
  subtitle: string;
  trend?: number;
  color?: 'green' | 'blue' | 'purple' | 'teal' | 'indigo';
}

interface ActivityItemProps {
  icon: React.ComponentType<{ size?: number }>;
  title: string;
  subtitle: string;
  time: string;
  status?: string;
}

// Dashboard data interfaces
interface LeagueStats {
  total: number;
  won: number;
  lost: number;
  pending: number;
}

interface CohortData {
  month: string;
  size: number;
  retention30: number;
}

interface WeeklyTrend {
  date: string;
  users: number;
  predictions: number;
  revenue: number;
}

interface DashboardSummary {
  overview?: {
    totalUsers?: number;
    totalPredictions?: number;
    totalRevenue?: number;
    activeSubscriptions?: number;
    userGrowthRate?: number;
    predictionGrowthRate?: number;
    revenueGrowth?: number;
    subscriptionGrowthRate?: number;
    userEngagementRate?: number;
    predictionAccuracy?: number;
    systemHealth?: {
      uptime?: number;
      responseTime?: number;
    };
  };
  advanced?: {
    behaviorPatterns?: {
      averagePredictionsPerUser?: number;
      activeUserPercentage?: number;
    };
    churnAnalysis?: {
      churnRate?: number;
    };
    predictionInsights?: {
      mostSuccessfulLeague?: string;
      leaguePerformance?: Record<string, LeagueStats>;
    };
    demographics?: {
      roleDistribution?: Record<string, number>;
      locationDistribution?: Record<string, number>;
    };
    revenueBreakdown?: {
      revenueByPlan?: Record<string, number>;
      revenueByProvider?: Record<string, number>;
    };
    cohortAnalysis?: CohortData[];
  };
  trends?: {
    userGrowth?: {
      activeUsers?: number;
      newUsers?: number;
      topUsers?: Array<{ user: User; score: number }>;
    };
    predictionPerformance?: {
      winRate?: number;
      lossRate?: number;
      pendingRate?: number;
      averageOdds?: number;
    };
    revenueMetrics?: {
      monthlyRecurringRevenue?: number;
      averageRevenuePerUser?: number;
      conversionRate?: number;
      customerLifetimeValue?: number;
    };
    engagementTrends?: {
      averageEngagement?: number;
      engagementBreakdown?: {
        views?: number;
        likes?: number;
        comments?: number;
        shares?: number;
      };
    };
    weeklyTrends?: WeeklyTrend[];
  };
  realTime?: {
    onlineUsers?: number;
    activeSessions?: number;
    liveMatches?: number;
    systemLoad?: number;
  };
  todayMetrics?: {
    newUsers?: number;
    newPredictions?: number;
    todayRevenue?: number;
    todayRevenueCount?: number;
    todayRevenueGrowth?: number;
    todayActiveUsers?: number;
    todayEngagement?: number;
    todayPredictionAccuracy?: number;
    todaySubscriptions?: number;
  };
  recentActivity?: {
    latestUsers?: User[];
    latestPredictions?: Prediction[];
    latestPayments?: Payment[];
  };
}

const Overview = ({ content }: { content?: { summary?: DashboardSummary } }) => {
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [summary, setSummary] = useState<DashboardSummary | null>(null)

  useEffect(() => {
    async function fetchAll() {
      setLoading(true)
      const cacheKey = 'dashboard_summary_cache'

      console.log('Fetched data:', content?.summary)
      // Cache the fresh summary
      if (typeof window !== 'undefined') {
        localStorage.setItem(cacheKey, JSON.stringify(content?.summary))
      }
      setSummary(content?.summary || null)
      setLoading(false)
      toast.success('Dashboard data loaded successfully!', {
        style: {
          backgroundColor: '#d4f5d6',
          color: '#4caf50',
          border: '1px solid #4caf50',
          borderRadius: '4px',
          padding: '12px 24px',
          cursor: 'pointer',
        }
      })
    }
    fetchAll()
  }, [content?.summary])

  // Helper to safely get a value
  const safe = function <T>(fn: () => T, fallback: T): T {
    try {
      const v = fn();
      return v === undefined || v === null ? fallback : v
    } catch {
      return fallback
    }
  }

  const StatCard = ({ icon: Icon, title, value, subtitle, trend, color = "green" }: StatCardProps) => (
    <div className="group bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-4">
            <div className={`p-3 rounded-xl bg-gradient-to-br ${color === 'green' ? 'from-green-500 to-green-600' :
              color === 'blue' ? 'from-blue-500 to-blue-600' :
                color === 'purple' ? 'from-purple-500 to-purple-600' :
                  color === 'teal' ? 'from-teal-500 to-teal-600' :
                    'from-indigo-500 to-indigo-600'
              } text-white shadow-lg`}>
              <Icon size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">{title}</p>
              {trend && (
                <div className={`flex items-center gap-1 text-xs ${trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {trend > 0 ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                  {Math.abs(trend)}% vs last month
                </div>
              )}
            </div>
          </div>
          <div>
            <h3 className="text-3xl font-bold text-gray-900 mb-1">{value}</h3>
            {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
          </div>
        </div>
      </div>
    </div>
  )

  const ActivityItem = ({ icon: Icon, title, subtitle, time, status }: ActivityItemProps) => (
    <div className="flex items-center gap-4 p-4 hover:bg-gray-50 rounded-xl transition-colors">
      <div className="p-2 bg-gray-100 rounded-lg text-gray-600">
        <Icon size={16} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-medium text-gray-900 truncate">{title}</p>
        <p className="text-sm text-gray-500 truncate">{subtitle}</p>
      </div>
      <div className="text-right">
        <p className="text-xs text-gray-400">{time}</p>
        {status && (
          <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium mt-1 ${status === 'Won' || status === 'completed' || status === 'SUCCESS' || status === 'WON' ? 'bg-green-100 text-green-700' :
            status === 'Pending' || status === 'pending' || status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' :
              'bg-red-100 text-red-700'
            }`}>
            {status === 'Won' || status === 'completed' || status === 'SUCCESS' || status === 'WON' ? <CheckCircle size={10} /> :
              status === 'Pending' || status === 'pending' || status === 'PENDING' ? <Clock size={10} /> :
                <XCircle size={10} />}
            {status}
          </div>
        )}
      </div>
    </div>
  )

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-green-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex items-center gap-3 px-6 py-3 bg-white rounded-2xl shadow-lg">
            <div className="animate-spin rounded-full h-6 w-6 border-2 border-green-500 border-t-transparent"></div>
            <span className="font-medium text-gray-700">Loading Dashboard...</span>
          </div>
        </div>
      </div>
    )
  }

  if (!summary) {
    return <div>No data available</div>
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100">
      <div className="p-4 w-full mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                Welcome back! 👋
              </h1>
              <p className="text-gray-600 mt-2">Here's what's happening with your platform today.</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="bg-white rounded-xl px-4 py-2 shadow-sm border border-gray-100">
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="font-medium text-gray-700">Live Data</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 lg:gap-6 mb-8">
          <StatCard
            icon={Users}
            title="Total Users"
            value={safe(() => formatNumberShort(summary.overview?.totalUsers || 0), '0')}
            subtitle="Active members"
            trend={safe(() => Number(summary.overview?.userGrowthRate?.toFixed(0)) || 0, 0)}
            color="green"
          />
          <StatCard
            icon={Target}
            title="Predictions"
            value={safe(() => formatNumberShort(summary.overview?.totalPredictions || 0), '0')}
            subtitle="Total predictions"
            trend={safe(() => Number(summary.overview?.predictionGrowthRate?.toFixed(0)) || 0, 0)}
            color="teal"
          />
          <StatCard
            icon={DollarSign}
            title="Revenue"
            value={safe(() => (user?.location?.currencysymbol || "$") + formatNumberShort(summary.overview?.totalRevenue || 0), '$0')}
            subtitle="Total earnings"
            trend={safe(() => Number(summary.overview?.revenueGrowth?.toFixed(0)) || 0, 0)}
            color="purple"
          />
          <StatCard
            icon={Crown}
            title="Subscriptions"
            value={safe(() => formatNumberShort(summary.overview?.activeSubscriptions || 0), '0')}
            subtitle="Active plans"
            trend={safe(() => Number(summary.overview?.subscriptionGrowthRate?.toFixed(0)) || 0, 0)}
            color="green"
          />
          <StatCard
            icon={TrendingUp}
            title="Today's Revenue"
            value={safe(() => (user?.location?.currencysymbol || "$") + formatNumberShort(summary.todayMetrics?.todayRevenue || 0), '$0')}
            subtitle="Last 24 hours"
            trend={safe(() => Number(summary.todayMetrics?.todayRevenueGrowth?.toFixed(0)) || 0, 0)}
            color="indigo"
          />
        </div>

        {/* Quick Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">Today's Activity</h3>
              <Activity className="text-gray-400" size={20} />
            </div>
            <div className="grid grid-cols-1 gap-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">New Users</span>
                <span className="font-semibold text-green-600">{safe(() => summary.todayMetrics?.newUsers, 0)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">New Predictions</span>
                <span className="font-semibold text-green-600">{safe(() => summary.todayMetrics?.newPredictions, 0)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">New Transactions</span>
                <span className="font-semibold text-green-600">{safe(() => summary.todayMetrics?.todayRevenueCount, 0)}</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">Win Rate</h3>
              <BarChart3 className="text-gray-400" size={20} />
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Success Rate</span>
                <span className="font-semibold text-green-600">{safe(() => summary.overview?.predictionAccuracy?.toFixed(1), '0')}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-green-400 to-green-600 h-2 rounded-full transition-all duration-700"
                  style={{ width: `${safe(() => summary.overview?.predictionAccuracy, 0)}%` }}
                ></div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">Top League</h3>
              <Crown className="text-gray-400" size={20} />
            </div>
            <div className="space-y-3">
              <div className="text-center">
                <p className="font-semibold text-lg text-gray-900">{safe(() => summary.advanced?.predictionInsights?.mostSuccessfulLeague, 'Premier League')}</p>
                <p className="text-sm text-gray-500">Most successful predictions</p>
              </div>
            </div>
          </div>
        </div>

        {/* Activity Feed */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
          {/* Recent Users */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <Users className="text-green-600" size={20} />
                <h3 className="font-semibold text-gray-900">New Members</h3>
              </div>
            </div>
            <div className="divide-y divide-gray-50 max-h-80 overflow-y-auto">
              {(safe(() => summary.recentActivity?.latestUsers, []) || []).slice(0, 5).map((user: User) => (
                <ActivityItem
                  key={user.id}
                  icon={Users}
                  title={user.username}
                  subtitle={user.email}
                  time={new Date(user.createdAt).toLocaleDateString()}
                  status={user.role}
                />
              ))}
            </div>
          </div>

          {/* Recent Predictions */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <Target className="text-green-600" size={20} />
                <h3 className="font-semibold text-gray-900">Live Predictions</h3>
              </div>
            </div>
            <div className="divide-y divide-gray-50 max-h-80 overflow-y-auto">
              {(safe(() => summary.recentActivity?.latestPredictions, []) || []).slice(0, 5).map((prediction: Prediction) => (
                <ActivityItem
                  key={prediction.id}
                  icon={Target}
                  title={`${prediction.homeTeam} vs ${prediction.awayTeam}`}
                  subtitle={`Tip: ${prediction.tip}`}
                  time={new Date(prediction.createdAt).toLocaleDateString()}
                  status={prediction.result}
                />
              ))}
            </div>
          </div>

          {/* Recent Payments */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <DollarSign className="text-green-600" size={20} />
                <h3 className="font-semibold text-gray-900">Transactions</h3>
              </div>
            </div>
            <div className="divide-y divide-gray-50 max-h-80 overflow-y-auto">
              {(safe(() => summary.recentActivity?.latestPayments, []) || []).slice(0, 5).map((payment: Payment) => (
                <ActivityItem
                  key={payment.id}
                  icon={DollarSign}
                  title={`${user?.location?.currencysymbol || '$'}${payment.amount.toFixed(2)}`}
                  subtitle="Payment received"
                  time={new Date(payment.createdAt).toLocaleDateString()}
                  status={payment.status}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Advanced Analytics Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Comprehensive Analytics Panel */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Platform Analytics</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl">
                <div className="text-2xl font-bold text-blue-600">
                  {safe(() => summary.advanced?.behaviorPatterns?.averagePredictionsPerUser?.toFixed(1), '0')}
                </div>
                <p className="text-sm text-blue-700 mt-1">Avg Predictions/User</p>
              </div>
              <div className="text-center p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-xl">
                <div className="text-2xl font-bold text-green-600">
                  {safe(() => summary.advanced?.behaviorPatterns?.activeUserPercentage?.toFixed(1), '0')}%
                </div>
                <p className="text-sm text-green-700 mt-1">Active Users</p>
              </div>
              <div className="text-center p-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl">
                <div className="text-2xl font-bold text-purple-600">
                  {safe(() => summary.advanced?.churnAnalysis?.churnRate?.toFixed(1), '0')}%
                </div>
                <p className="text-sm text-purple-700 mt-1">Churn Rate</p>
              </div>
              <div className="text-center p-4 bg-gradient-to-r from-yellow-50 to-yellow-100 rounded-xl">
                <div className="text-2xl font-bold text-yellow-600">
                  {safe(() => summary.overview?.systemHealth?.uptime?.toFixed(1), '99.9')}%
                </div>
                <p className="text-sm text-yellow-700 mt-1">System Uptime</p>
              </div>
            </div>
          </div>

          {/* Revenue Breakdown Panel */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Revenue Insights</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Monthly Recurring Revenue</span>
                <span className="font-semibold text-green-600">
                  {safe(() => (user?.location?.currencysymbol || "$") + formatNumberShort(summary.trends?.revenueMetrics?.monthlyRecurringRevenue || 0), '$0')}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Avg Revenue Per User</span>
                <span className="font-semibold text-blue-600">
                  {safe(() => (user?.location?.currencysymbol || "$") + (summary.trends?.revenueMetrics?.averageRevenuePerUser?.toFixed(2) || '0.00'), '$0.00')}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Conversion Rate</span>
                <span className="font-semibold text-purple-600">
                  {safe(() => summary.trends?.revenueMetrics?.conversionRate?.toFixed(1), '0')}%
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Customer Lifetime Value</span>
                <span className="font-semibold text-indigo-600">
                  {safe(() => (user?.location?.currencysymbol || "$") + (summary.trends?.revenueMetrics?.customerLifetimeValue?.toFixed(2) || '0.00'), '$0.00')}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Real-time Metrics */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Real-time Metrics</h3>
            <div className="flex items-center gap-2 text-sm">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="font-medium text-gray-700">Live</span>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-xl">
              <div className="text-2xl font-bold text-green-600">
                {safe(() => summary.realTime?.onlineUsers, 0)}
              </div>
              <p className="text-sm text-green-700 mt-1">Online Users</p>
            </div>
            <div className="text-center p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl">
              <div className="text-2xl font-bold text-blue-600">
                {safe(() => summary.realTime?.activeSessions, 0)}
              </div>
              <p className="text-sm text-blue-700 mt-1">Active Sessions</p>
            </div>
            <div className="text-center p-4 bg-gradient-to-r from-orange-50 to-orange-100 rounded-xl">
              <div className="text-2xl font-bold text-orange-600">
                {safe(() => summary.realTime?.liveMatches, 0)}
              </div>
              <p className="text-sm text-orange-700 mt-1">Live Matches</p>
            </div>
            <div className="text-center p-4 bg-gradient-to-r from-red-50 to-red-100 rounded-xl">
              <div className="text-2xl font-bold text-red-600">
                {safe(() => summary.realTime?.systemLoad?.toFixed(1), '0')}%
              </div>
              <p className="text-sm text-red-700 mt-1">System Load</p>
            </div>
          </div>
        </div>

      

        {/* Performance Insights */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Prediction Performance */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">Prediction Performance</h3>
              <Target className="text-gray-400" size={20} />
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Win Rate</span>
                <span className="font-semibold text-green-600">
                  {safe(() => summary.trends?.predictionPerformance?.winRate?.toFixed(1), '0')}%
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Loss Rate</span>
                <span className="font-semibold text-red-600">
                  {safe(() => summary.trends?.predictionPerformance?.lossRate?.toFixed(1), '0')}%
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Pending</span>
                <span className="font-semibold text-yellow-600">
                  {safe(() => summary.trends?.predictionPerformance?.pendingRate?.toFixed(1), '0')}%
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Average Odds</span>
                <span className="font-semibold text-blue-600">
                  {safe(() => summary.trends?.predictionPerformance?.averageOdds?.toFixed(2), '0.00')}
                </span>
              </div>
            </div>
          </div>

          {/* User Analytics */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">User Analytics</h3>
              <Users className="text-gray-400" size={20} />
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Active Users</span>
                <span className="font-semibold text-green-600">
                  {safe(() => summary.trends?.userGrowth?.activeUsers, 0)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">New Users (30d)</span>
                <span className="font-semibold text-blue-600">
                  {safe(() => summary.trends?.userGrowth?.newUsers, 0)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Top Users</span>
                <span className="font-semibold text-purple-600">
                  {safe(() => summary.trends?.userGrowth?.topUsers?.length, 0)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Engagement Rate</span>
                <span className="font-semibold text-indigo-600">
                  {safe(() => summary.overview?.userEngagementRate?.toFixed(1), '0')}%
                </span>
              </div>
            </div>
          </div>

          {/* Today's Extended Metrics */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">Today's Extended</h3>
              <Activity className="text-gray-400" size={20} />
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Active Users</span>
                <span className="font-semibold text-green-600">
                  {safe(() => summary.todayMetrics?.todayActiveUsers, 0)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">New Subscriptions</span>
                <span className="font-semibold text-blue-600">
                  {safe(() => summary.todayMetrics?.todaySubscriptions, 0)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Prediction Accuracy</span>
                <span className="font-semibold text-purple-600">
                  {safe(() => summary.todayMetrics?.todayPredictionAccuracy?.toFixed(1), '0')}%
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Total Engagement</span>
                <span className="font-semibold text-indigo-600">
                  {safe(() => summary.todayMetrics?.todayEngagement, 0)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* League Performance & Demographics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* League Performance */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <Crown className="text-green-600" size={20} />
                <h3 className="font-semibold text-gray-900">League Performance</h3>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Most Successful League</span>
                  <span className="font-semibold text-green-600">
                    {safe(() => summary.advanced?.predictionInsights?.mostSuccessfulLeague, 'Premier League')}
                  </span>
                </div>
                <div className="space-y-3">
                  {safe(() => Object.entries(summary.advanced?.predictionInsights?.leaguePerformance || {}), []).slice(0, 5).map(([league, stats]: [string, unknown]) => (
                    <div key={league} className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 truncate">{league}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-500">{(stats as LeagueStats).won}/{(stats as LeagueStats).total}</span>
                        <span className="font-medium text-blue-600">
                          {(((stats as LeagueStats).won / (stats as LeagueStats).total) * 100).toFixed(1)}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* User Demographics */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <Users className="text-green-600" size={20} />
                <h3 className="font-semibold text-gray-900">User Demographics</h3>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">By Role</h4>
                  <div className="space-y-2">
                    {safe(() => Object.entries(summary.advanced?.demographics?.roleDistribution || {}), []).map(([role, count]: [string, unknown]) => (
                      <div key={role} className="flex justify-between items-center">
                        <span className="text-sm text-gray-600 capitalize">{role.toLowerCase()}</span>
                        <span className="font-medium text-indigo-600">{count as number}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Top Locations</h4>
                  <div className="space-y-2">
                    {safe(() => {
                      // Process location data and parse JSON strings to extract country names
                      const locationData: Record<string, number> = {};
                      const rawLocationData = summary.advanced?.demographics?.locationDistribution || {};

                      Object.entries(rawLocationData).forEach(([location, count]) => {
                        let countryName = location;

                        // Try to parse JSON string and extract country name
                        try {
                          if (typeof location === 'string' && (location.startsWith('{') || location.startsWith('['))) {
                            const parsedLocation = JSON.parse(location);
                            countryName = parsedLocation.country ||
                              parsedLocation.countryName ||
                              parsedLocation.name ||
                              parsedLocation.countryCode ||
                              location;
                          }
                        } catch (_error) {
                          // If parsing fails, use the original location string
                          countryName = location;
                        }

                        // Aggregate counts by country name
                        locationData[countryName] = (locationData[countryName] || 0) + (count as number);
                      });

                      return Object.entries(locationData);
                    }, []).slice(0, 4).map(([country, count]: [string, unknown]) => (
                      <div key={country} className="flex justify-between items-center">
                        <span className="text-sm text-gray-600 truncate">{country}</span>
                        <span className="font-medium text-purple-600">{count as number}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Revenue Breakdown & Cohort Analysis */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Revenue Breakdown</h3>
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-3">By Subscription Plan</h4>
                <div className="space-y-2">
                  {safe(() => Object.entries(summary.advanced?.revenueBreakdown?.revenueByPlan || {}), []).map(([plan, revenue]) => (
                    <div key={plan} className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 capitalize">{plan.toLowerCase()}</span>
                      <span className="font-semibold text-green-600">
                        {user?.location?.currencysymbol || '$'}{(revenue as number).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-3">By Payment Provider</h4>
                <div className="space-y-2">
                  {safe(() => Object.entries(summary.advanced?.revenueBreakdown?.revenueByProvider || {}), []).map(([provider, revenue]) => (
                    <div key={provider} className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 capitalize">{provider}</span>
                      <span className="font-semibold text-blue-600">
                        {user?.location?.currencysymbol || '$'}{(revenue as number).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Cohort Analysis</h3>
            <div className="space-y-4">
              {(safe(() => summary.advanced?.cohortAnalysis, []) || []).slice(0, 6).map((cohort: CohortData, index: number) => (
                <div key={cohort.month || index} className="flex justify-between items-center">
                  <div>
                    <span className="text-sm font-medium text-gray-900">{cohort.month}</span>
                    <p className="text-xs text-gray-500">{cohort.size} users</p>
                  </div>
                  <div className="text-right">
                    <span className="font-semibold text-indigo-600">{cohort.retention30?.toFixed(1)}%</span>
                    <p className="text-xs text-gray-500">30-day retention</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Weekly Trends Chart */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">7-Day Performance Trends</h3>
          <div className="grid grid-cols-1 lg:grid-cols-7 gap-8 lg:gap-2">
            {(safe(() => summary.trends?.weeklyTrends, []) || []).map((day: WeeklyTrend, index: number) => (
              <div key={day.date || index} className="text-center">
                <div className="text-xs text-gray-500 mb-2">{new Date(day.date).toLocaleDateString('en', { weekday: 'short' })}</div>
                <div className="space-y-2">
                  <div className="bg-green-100 rounded-lg p-2">
                    <div className="text-sm font-semibold text-green-700">{day.users}</div>
                    <div className="text-xs text-green-600">Users</div>
                  </div>
                  <div className="bg-green-200 rounded-lg p-2">
                    <div className="text-sm font-semibold text-green-800">{day.predictions}</div>
                    <div className="text-xs text-green-700">Predictions</div>
                  </div>
                  <div className="bg-green-300 rounded-lg p-2">
                    <div className="text-sm font-semibold text-green-900">
                      {user?.location?.currencysymbol || '$'}{day.revenue?.toFixed(0)}
                    </div>
                    <div className="text-xs text-green-800">Revenue</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Overview
