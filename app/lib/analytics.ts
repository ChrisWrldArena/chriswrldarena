// Analytics Helper Functions for ChrisWrldArena Platform
// Comprehensive statistical analysis and metrics functions

import {
    User, Prediction, Subscription, Payment,
    View, Comment, Like, Save, Share,  Notification,
    UserRole, PredictionResult, SubscriptionStatus, PaymentStatus,
    SubscriptionPlan, CommentEngagement
} from '@prisma/client';

// Extended types with relations
type PredictionWithRelations = Prediction & {
    createdBy: User;
    Share: Share[];
    Save: Save[];
    Like: Like[];
    Comment: Comment[];
    View: View[];
};

type UserWithRelations = User & {
    predictions: Prediction[];
    subscriptions: Subscription[];
    payments: Payment[];
    Notification: Notification[];
    View: View[];
    Like: Like[];
    Save: Save[];
    Share: Share[];
    comments: Comment[];
};

// Base interfaces for analytics
interface DateRange {
    startDate: Date;
    endDate: Date;
}

interface StatisticalSummary {
    count: number;
    total?: number;
    average?: number;
    median?: number;
    mode?: any;
    min?: number;
    max?: number;
    variance?: number;
    standardDeviation?: number;
    percentiles?: {
        p25: number;
        p50: number;
        p75: number;
        p90: number;
        p95: number;
    };
}

interface EngagementMetrics {
    totalViews: number;
    totalLikes: number;
    totalComments: number;
    totalSaves: number;
    totalShares: number;
    engagementRate: number;
    averageEngagementPerPost: number;
}

interface RevenueMetrics {
    totalRevenue: number;
    monthlyRecurringRevenue: number;
    averageRevenuePerUser: number;
    conversionRate: number;
    churnRate: number;
    customerLifetimeValue: number;
}

interface PredictionMetrics {
    totalPredictions: number;
    winRate: number;
    lossRate: number;
    pendingRate: number;
    averageOdds: number;
    mostSuccessfulLeague: string;
    performanceByMonth: Array<{ month: string; winRate: number }>;
}

// ============= STATISTICAL HELPER FUNCTIONS =============

export class StatisticsHelper {
    // Helper function to check if subscription is active
    static isActiveSubscription(subscription: Subscription): boolean {
        return subscription.status === 'ACTIVE' || 
               (subscription.expiresAt && new Date(subscription.expiresAt) > new Date());
    }

    static calculateMean(values: number[]): number {
        if (values.length === 0) return 0;
        return values.reduce((sum, val) => sum + val, 0) / values.length;
    }

    static calculateMedian(values: number[]): number {
        if (values.length === 0) return 0;
        const sorted = [...values].sort((a, b) => a - b);
        const mid = Math.floor(sorted.length / 2);
        return sorted.length % 2 === 0
            ? (sorted[mid - 1] + sorted[mid]) / 2
            : sorted[mid];
    }

    static calculateMode(values: any[]): any {
        const frequency: { [key: string]: number } = {};
        values.forEach(val => {
            const key = String(val);
            frequency[key] = (frequency[key] || 0) + 1;
        });

        let maxCount = 0;
        let mode = null;
        Object.entries(frequency).forEach(([key, count]) => {
            if (count > maxCount) {
                maxCount = count;
                mode = values.find(val => String(val) === key);
            }
        });
        return mode;
    }

    static calculateVariance(values: number[]): number {
        if (values.length <= 1) return 0;
        const mean = this.calculateMean(values);
        const squaredDiffs = values.map(val => Math.pow(val - mean, 2));
        return this.calculateMean(squaredDiffs);
    }

    static calculateStandardDeviation(values: number[]): number {
        return Math.sqrt(this.calculateVariance(values));
    }

    static calculatePercentile(values: number[], percentile: number): number {
        if (values.length === 0) return 0;
        const sorted = [...values].sort((a, b) => a - b);
        const index = (percentile / 100) * (sorted.length - 1);
        const lower = Math.floor(index);
        const upper = Math.ceil(index);

        if (lower === upper) return sorted[lower];
        return sorted[lower] * (upper - index) + sorted[upper] * (index - lower);
    }

    static getStatisticalSummary(values: number[]): StatisticalSummary {
        if (values.length === 0) {
            return { count: 0 };
        }

        return {
            count: values.length,
            total: values.reduce((sum, val) => sum + val, 0),
            average: this.calculateMean(values),
            median: this.calculateMedian(values),
            min: Math.min(...values),
            max: Math.max(...values),
            variance: this.calculateVariance(values),
            standardDeviation: this.calculateStandardDeviation(values),
            percentiles: {
                p25: this.calculatePercentile(values, 25),
                p50: this.calculatePercentile(values, 50),
                p75: this.calculatePercentile(values, 75),
                p90: this.calculatePercentile(values, 90),
                p95: this.calculatePercentile(values, 95),
            }
        };
    }
}

// ============= DATE UTILITY FUNCTIONS =============

export class DateHelper {
    static isWithinDateRange(date: Date, range: DateRange): boolean {
        return new Date(date) >= range.startDate && new Date(date) <= range.endDate;
    }

    static getDateRanges() {
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

        return {
            today: {
                startDate: today,
                endDate: new Date(today.getTime() + 24 * 60 * 60 * 1000 - 1)
            },
            yesterday: {
                startDate: new Date(today.getTime() - 24 * 60 * 60 * 1000),
                endDate: new Date(today.getTime() - 1)
            },
            thisWeek: {
                startDate: new Date(today.getTime() - (today.getDay() * 24 * 60 * 60 * 1000)),
                endDate: now
            },
            thisMonth: {
                startDate: new Date(now.getFullYear(), now.getMonth(), 1),
                endDate: now
            },
            last30Days: {
                startDate: new Date(now.getTime() - (30 * 24 * 60 * 60 * 1000)),
                endDate: now
            },
            last90Days: {
                startDate: new Date(now.getTime() - (90 * 24 * 60 * 60 * 1000)),
                endDate: now
            },
            thisYear: {
                startDate: new Date(now.getFullYear(), 0, 1),
                endDate: now
            }
        };
    }

    static groupByTimeInterval<T extends { createdAt: Date }>(
        items: T[],
        interval: 'day' | 'week' | 'month' | 'year'
    ): { [key: string]: T[] } {
        const groups: { [key: string]: T[] } = {};

        items.forEach(item => {
            let key: string;
            const date = new Date(item.createdAt);

            switch (interval) {
                case 'day':
                    key = date.toISOString().split('T')[0];
                    break;
                case 'week':
                    const weekStart = new Date(date);
                    weekStart.setDate(date.getDate() - date.getDay());
                    key = weekStart.toISOString().split('T')[0];
                    break;
                case 'month':
                    key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
                    break;
                case 'year':
                    key = String(date.getFullYear());
                    break;
            }

            if (!groups[key]) groups[key] = [];
            groups[key].push(item);
        });

        return groups;
    }
}

// ============= USER ANALYTICS =============

export class UserAnalytics {
    static getUserMetrics(users: UserWithRelations[], dateRange?: DateRange): {
        totalUsers: number;
        activeUsers: number;
        newUsers: number;
        usersByRole: { [key in UserRole]: number };
        userGrowth: Array<{ date: string; count: number }>;
        topUsers: Array<{ user: User; score: number }>;
    } {
        const filteredUsers = dateRange
            ? users.filter(user => DateHelper.isWithinDateRange(user.createdAt, dateRange))
            : users;

        const usersByRole = users.reduce((acc, user) => {
            acc[user.role] = (acc[user.role] || 0) + 1;
            return acc;
        }, {} as { [key in UserRole]: number });

        // Calculate user growth over time
        const userGrowth = Object.entries(
            DateHelper.groupByTimeInterval(users, 'month')
        ).map(([date, usersInMonth]) => ({
            date,
            count: usersInMonth.length
        }));

        // Calculate top users based on engagement
        const topUsers = users.map(user => {
            const score = user.predictions.length * 3 +
                user.subscriptions.filter(s => StatisticsHelper.isActiveSubscription(s)).length * 10;
            return { user, score };
        }).sort((a, b) => b.score - a.score).slice(0, 10);

        return {
            totalUsers: users.length,
            activeUsers: users.filter(user =>
                user.subscriptions.some(s => StatisticsHelper.isActiveSubscription(s)) ||
                user.predictions.some(p =>
                    new Date(p.createdAt) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
                )
            ).length,
            newUsers: filteredUsers.length,
            usersByRole,
            userGrowth,
            topUsers
        };
    }

    static getUserEngagementMetrics(users: UserWithRelations[]): EngagementMetrics {
        // Calculate engagement based on user interactions with predictions and platform
        const totalViews = users.reduce((sum, user) => sum + user.View.length, 0);
        const totalLikes = users.reduce((sum, user) => sum + user.Like.length, 0);
        const totalComments = users.reduce((sum, user) => sum + user.comments.length, 0);
        const totalSaves = users.reduce((sum, user) => sum + user.Save.length, 0);
        const totalShares = users.reduce((sum, user) => sum + user.Share.length, 0);

        const totalPredictions = users.reduce((sum, user) => sum + user.predictions.length, 0);
        const totalEngagement = totalLikes + totalComments + totalSaves + totalShares;

        return {
            totalViews,
            totalLikes,
            totalComments,
            totalSaves,
            totalShares,
            engagementRate: totalViews > 0 ? (totalEngagement / totalViews) * 100 : 0,
            averageEngagementPerPost: totalPredictions > 0 ? totalEngagement / totalPredictions : 0
        };
    }
}

// ============= PREDICTION ANALYTICS =============

export class PredictionAnalytics {
    static getPredictionMetrics(predictions: PredictionWithRelations[], dateRange?: DateRange): PredictionMetrics {
        const filteredPredictions = dateRange
            ? predictions.filter(p => DateHelper.isWithinDateRange(p.publishedAt, dateRange))
            : predictions;

        const totalPredictions = filteredPredictions.length;
        const wonPredictions = filteredPredictions.filter(p => p.result === 'WON').length;
        const lostPredictions = filteredPredictions.filter(p => p.result === 'LOST').length;
        const pendingPredictions = filteredPredictions.filter(p => p.result === 'PENDING').length;

        const winRate = totalPredictions > 0 ? (wonPredictions / totalPredictions) * 100 : 0;
        const lossRate = totalPredictions > 0 ? (lostPredictions / totalPredictions) * 100 : 0;
        const pendingRate = totalPredictions > 0 ? (pendingPredictions / totalPredictions) * 100 : 0;

        // Calculate average odds
        const oddsValues = filteredPredictions
            .filter(p => p.odds)
            .map(p => parseFloat(p.odds!))
            .filter(odds => !isNaN(odds));

        const averageOdds = StatisticsHelper.calculateMean(oddsValues);

        // Find most successful league
        const leagueStats = filteredPredictions.reduce((acc, prediction) => {
            if (!acc[prediction.league]) {
                acc[prediction.league] = { total: 0, won: 0 };
            }
            acc[prediction.league].total++;
            if (prediction.result === 'WON') {
                acc[prediction.league].won++;
            }
            return acc;
        }, {} as { [league: string]: { total: number; won: number } });

        const mostSuccessfulLeague = Object.entries(leagueStats)
            .map(([league, stats]) => ({
                league,
                winRate: stats.total > 0 ? (stats.won / stats.total) * 100 : 0
            }))
            .sort((a, b) => b.winRate - a.winRate)[0]?.league || '';

        // Performance by month
        const monthlyGroups = DateHelper.groupByTimeInterval(filteredPredictions, 'month');
        const performanceByMonth = Object.entries(monthlyGroups).map(([month, preds]) => {
            const monthWon = preds.filter(p => p.result === 'WON').length;
            const monthTotal = preds.filter(p => p.result !== 'PENDING').length;
            return {
                month,
                winRate: monthTotal > 0 ? (monthWon / monthTotal) * 100 : 0
            };
        });

        return {
            totalPredictions,
            winRate,
            lossRate,
            pendingRate,
            averageOdds,
            mostSuccessfulLeague,
            performanceByMonth
        };
    }

    static getPredictionEngagement(predictions: PredictionWithRelations[]): EngagementMetrics {
        const totalViews = predictions.reduce((sum, p) => sum + p.View.length, 0);
        const totalLikes = predictions.reduce((sum, p) => sum + p.Like.length, 0);
        const totalComments = predictions.reduce((sum, p) => sum + p.Comment.length, 0);
        const totalSaves = predictions.reduce((sum, p) => sum + p.Save.length, 0);
        const totalShares = predictions.reduce((sum, p) => sum + p.Share.length, 0);

        const totalEngagement = totalLikes + totalComments + totalSaves + totalShares;

        return {
            totalViews,
            totalLikes,
            totalComments,
            totalSaves,
            totalShares,
            engagementRate: totalViews > 0 ? (totalEngagement / totalViews) * 100 : 0,
            averageEngagementPerPost: predictions.length > 0 ? totalEngagement / predictions.length : 0
        };
    }
}

// ============= REVENUE ANALYTICS =============

export class RevenueAnalytics {
    static getRevenueMetrics(
        payments: Payment[],
        subscriptions: Subscription[],
        users: User[],
        dateRange?: DateRange
    ): RevenueMetrics {
        const filteredPayments = dateRange
            ? payments.filter(p => DateHelper.isWithinDateRange(p.createdAt, dateRange))
            : payments;

        const successfulPayments = filteredPayments.filter(p => p.status === 'SUCCESS');
        const totalRevenue = successfulPayments.reduce((sum, p) => sum + p.amount, 0);

        // Calculate MRR (Monthly Recurring Revenue)
        const activeSubscriptions = subscriptions.filter(s => StatisticsHelper.isActiveSubscription(s));
        const monthlyRevenue = activeSubscriptions.reduce((sum, sub) => {
            switch (sub.plan) {
                case 'MONTHLY': return sum + (payments.find(p => p.userId === sub.userId)?.amount || 0);
                case 'YEARLY': return sum + ((payments.find(p => p.userId === sub.userId)?.amount || 0) / 12);
                case 'WEEKLY': return sum + ((payments.find(p => p.userId === sub.userId)?.amount || 0) * 4.33);
                case 'DAILY': return sum + ((payments.find(p => p.userId === sub.userId)?.amount || 0) * 30);
                default: return sum;
            }
        }, 0);

        const totalUsers = users.length;
        const averageRevenuePerUser = totalUsers > 0 ? totalRevenue / totalUsers : 0;

        // Calculate conversion rate (users with active subscriptions / total users)
        const subscribedUsers = activeSubscriptions.length;
        const conversionRate = totalUsers > 0 ? (subscribedUsers / totalUsers) * 100 : 0;

        // Calculate churn rate (expired subscriptions in last month)
        const lastMonth = new Date();
        lastMonth.setMonth(lastMonth.getMonth() - 1);
        const churnedSubscriptions = subscriptions.filter(s =>
            s.status === 'EXPIRED' && s.updatedAt > lastMonth
        ).length;
        const churnRate = activeSubscriptions.length > 0 ?
            (churnedSubscriptions / (activeSubscriptions.length + churnedSubscriptions)) * 100 : 0;

        // Estimate Customer Lifetime Value
        const avgSubscriptionLength = 12; // months (estimate)
        const customerLifetimeValue = averageRevenuePerUser * avgSubscriptionLength;

        return {
            totalRevenue,
            monthlyRecurringRevenue: monthlyRevenue,
            averageRevenuePerUser,
            conversionRate,
            churnRate,
            customerLifetimeValue
        };
    }

    static getPaymentAnalytics(payments: Payment[]): {
        paymentsByStatus: { [key in PaymentStatus]: number };
        paymentsByProvider: { [provider: string]: number };
        averagePaymentAmount: number;
        paymentTrends: Array<{ date: string; amount: number; count: number }>;
    } {
        const paymentsByStatus = payments.reduce((acc, payment) => {
            acc[payment.status] = (acc[payment.status] || 0) + 1;
            return acc;
        }, {} as { [key in PaymentStatus]: number });

        const paymentsByProvider = payments.reduce((acc, payment) => {
            acc[payment.provider] = (acc[payment.provider] || 0) + 1;
            return acc;
        }, {} as { [provider: string]: number });

        const successfulPayments = payments.filter(p => p.status === 'SUCCESS');
        const amounts = successfulPayments.map(p => p.amount);
        const averagePaymentAmount = StatisticsHelper.calculateMean(amounts);

        const monthlyGroups = DateHelper.groupByTimeInterval(payments, 'month');
        const paymentTrends = Object.entries(monthlyGroups).map(([date, monthPayments]) => ({
            date,
            amount: monthPayments.filter(p => p.status === 'SUCCESS').reduce((sum, p) => sum + p.amount, 0),
            count: monthPayments.length
        }));

        return {
            paymentsByStatus,
            paymentsByProvider,
            averagePaymentAmount,
            paymentTrends
        };
    }
}

// ============= PERFORMANCE ANALYTICS =============

export class PerformanceAnalytics {
    static getSystemPerformance(data: {
        users: UserWithRelations[];
        predictions: PredictionWithRelations[];
        payments: Payment[];
        subscriptions: Subscription[];
    }) {
        const now = new Date();

        // Calculate engagement rates
        const totalUsers = data.users.length;
        const activeUsers = data.users.filter(user => 
            user.predictions.some(p => new Date(p.createdAt) > new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)) ||
            user.subscriptions.some(s => StatisticsHelper.isActiveSubscription(s))
        ).length;

        // Platform health metrics
        const healthMetrics = {
            userEngagementRate: totalUsers > 0 ? (activeUsers / totalUsers) * 100 : 0,
            predictionAccuracy: this.calculatePredictionAccuracy(data.predictions),
            revenueGrowth: this.calculateRevenueGrowth(data.payments),
            systemUptime: 99.9, // This would come from monitoring tools
            responseTime: Math.random() * 200 + 100 // This would come from performance monitoring
        };

        return healthMetrics;
    }

    private static calculatePredictionAccuracy(predictions: PredictionWithRelations[]): number {
        const completedPredictions = predictions.filter(p => p.result === 'WON' || p.result === 'LOST');
        const wonPredictions = predictions.filter(p => p.result === 'WON');
        return completedPredictions.length > 0 ? (wonPredictions.length / completedPredictions.length) * 100 : 0;
    }

    private static calculateRevenueGrowth(payments: Payment[]): number {
        const now = new Date();
        const thisMonth = payments.filter(p => 
            p.status === 'SUCCESS' && 
            p.createdAt.getMonth() === now.getMonth() && 
            p.createdAt.getFullYear() === now.getFullYear()
        );
        const lastMonth = payments.filter(p => {
            const lastMonthDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
            return p.status === 'SUCCESS' && 
                   p.createdAt.getMonth() === lastMonthDate.getMonth() && 
                   p.createdAt.getFullYear() === lastMonthDate.getFullYear();
        });

        const thisMonthRevenue = thisMonth.reduce((sum, p) => sum + p.amount, 0);
        const lastMonthRevenue = lastMonth.reduce((sum, p) => sum + p.amount, 0);

        return lastMonthRevenue > 0 ? ((thisMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100 : 0;
    }
}

// ============= ADVANCED ANALYTICS =============

export class AdvancedAnalytics {
    static getAdvancedMetrics(data: {
        users: UserWithRelations[];
        predictions: PredictionWithRelations[];
        payments: Payment[];
        subscriptions: Subscription[];
    }) {
        return {
            demographics: this.getUserDemographics(data.users),
            behaviorPatterns: this.getBehaviorPatterns(data.users),
            predictionInsights: this.getPredictionInsights(data.predictions),
            revenueBreakdown: this.getRevenueBreakdown(data.payments, data.subscriptions),
            cohortAnalysis: this.getCohortAnalysis(data.users),
            churnAnalysis: this.getChurnAnalysis(data.subscriptions),
            seasonalTrends: this.getSeasonalTrends(data.predictions)
        };
    }

    private static getUserDemographics(users: UserWithRelations[]) {
        const roleDistribution = users.reduce((acc, user) => {
            acc[user.role] = (acc[user.role] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        const locationDistribution = users.reduce((acc, user) => {
            const location = user.location || 'Unknown';
            acc[location] = (acc[location] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        return { roleDistribution, locationDistribution };
    }

    private static getBehaviorPatterns(users: UserWithRelations[]) {
        const patterns = users.map(user => ({
            userId: user.id,
            predictionFrequency: user.predictions.length,
            paymentHistory: user.payments.length,
            lastActivity: user.predictions.length > 0 ? 
                Math.max(...user.predictions.map(p => new Date(p.createdAt).getTime())) : 0
        }));

        return {
            averagePredictionsPerUser: StatisticsHelper.calculateMean(patterns.map(p => p.predictionFrequency)),
            activeUserPercentage: patterns.filter(p => p.lastActivity > Date.now() - 30 * 24 * 60 * 60 * 1000).length / patterns.length * 100
        };
    }

    private static getPredictionInsights(predictions: PredictionWithRelations[]) {
        const leaguePerformance = predictions.reduce((acc, pred) => {
            if (!acc[pred.league]) {
                acc[pred.league] = { total: 0, won: 0, lost: 0, pending: 0 };
            }
            acc[pred.league].total++;
            acc[pred.league][pred.result.toLowerCase() as 'won' | 'lost' | 'pending']++;
            return acc;
        }, {} as Record<string, { total: number; won: number; lost: number; pending: number }>);

        const tipTypePerformance = predictions.reduce((acc, pred) => {
            if (!acc[pred.tip]) {
                acc[pred.tip] = { total: 0, won: 0, winRate: 0 };
            }
            acc[pred.tip].total++;
            if (pred.result === 'WON') acc[pred.tip].won++;
            acc[pred.tip].winRate = (acc[pred.tip].won / acc[pred.tip].total) * 100;
            return acc;
        }, {} as Record<string, { total: number; won: number; winRate: number }>);

        return { leaguePerformance, tipTypePerformance };
    }

    private static getRevenueBreakdown(payments: Payment[], subscriptions: Subscription[]) {
        const revenueByPlan = subscriptions.reduce((acc, sub) => {
            const payment = payments.find(p => p.userId === sub.userId && p.status === 'SUCCESS');
            if (payment) {
                acc[sub.plan] = (acc[sub.plan] || 0) + payment.amount;
            }
            return acc;
        }, {} as Record<string, number>);

        const revenueByProvider = payments
            .filter(p => p.status === 'SUCCESS')
            .reduce((acc, payment) => {
                acc[payment.provider] = (acc[payment.provider] || 0) + payment.amount;
                return acc;
            }, {} as Record<string, number>);

        return { revenueByPlan, revenueByProvider };
    }

    private static getCohortAnalysis(users: UserWithRelations[]) {
        const cohorts = DateHelper.groupByTimeInterval(users, 'month');
        return Object.entries(cohorts).map(([month, cohortUsers]) => ({
            month,
            size: cohortUsers.length,
            retention30: cohortUsers.filter(u => 
                u.predictions.some(p => 
                    new Date(p.createdAt) > new Date(new Date(u.createdAt).getTime() + 30 * 24 * 60 * 60 * 1000)
                )
            ).length / cohortUsers.length * 100
        }));
    }

    private static getChurnAnalysis(subscriptions: Subscription[]) {
        const totalSubscriptions = subscriptions.length;
        const expiredSubscriptions = subscriptions.filter(s => s.status === 'EXPIRED').length;
        const cancelledSubscriptions = subscriptions.filter(s => s.status === 'CANCELLED').length;
        
        return {
            churnRate: totalSubscriptions > 0 ? ((expiredSubscriptions + cancelledSubscriptions) / totalSubscriptions) * 100 : 0,
            expiredRate: totalSubscriptions > 0 ? (expiredSubscriptions / totalSubscriptions) * 100 : 0,
            cancelledRate: totalSubscriptions > 0 ? (cancelledSubscriptions / totalSubscriptions) * 100 : 0
        };
    }

    private static getSeasonalTrends(predictions: PredictionWithRelations[]) {
        const monthlyData = predictions.reduce((acc, pred) => {
            const month = new Date(pred.createdAt).getMonth();
            if (!acc[month]) acc[month] = { count: 0, winRate: 0, wins: 0 };
            acc[month].count++;
            if (pred.result === 'WON') acc[month].wins++;
            acc[month].winRate = (acc[month].wins / acc[month].count) * 100;
            return acc;
        }, {} as Record<number, { count: number; winRate: number; wins: number }>);

        return monthlyData;
    }
}

// ============= SUMMARY AND HISTORY FUNCTIONS =============

export class SummaryAnalytics {
    static getLatestOperationsSummary<T extends { createdAt: Date }>(
        operations: T[],
        limit: number = 5
    ): T[] {
        return operations
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
            .slice(0, limit);
    }

    static getDashboardSummary(data: {
        users: UserWithRelations[];
        predictions: PredictionWithRelations[];
        payments: Payment[];
        subscriptions: Subscription[];
    }) {
        const dateRanges = DateHelper.getDateRanges();
        try {
            // Enhanced overview with performance metrics
            const performanceMetrics = PerformanceAnalytics.getSystemPerformance(data);
            const advancedMetrics = AdvancedAnalytics.getAdvancedMetrics(data);

            return {
                overview: {
                    totalUsers: data.users.length,
                    totalPredictions: data.predictions.length,
                    totalRevenue: data.payments
                        .filter(p => p.status === 'SUCCESS')
                        .reduce((sum, p) => sum + p.amount, 0),
                    activeSubscriptions: data.subscriptions.filter(s => 
                        StatisticsHelper.isActiveSubscription(s)
                    ).length,
                    // Growth rates for trends
                    userGrowthRate: this.calculateUserGrowthRate(data.users),
                    predictionGrowthRate: this.calculatePredictionGrowthRate(data.predictions),
                    revenueGrowth: performanceMetrics.revenueGrowth,
                    subscriptionGrowthRate: this.calculateSubscriptionGrowthRate(data.subscriptions),
                    // Additional performance indicators
                    userEngagementRate: performanceMetrics.userEngagementRate,
                    predictionAccuracy: performanceMetrics.predictionAccuracy,
                    systemHealth: {
                        uptime: performanceMetrics.systemUptime,
                        responseTime: performanceMetrics.responseTime
                    }
                },
                recentActivity: {
                    latestUsers: this.getLatestOperationsSummary(data.users),
                    latestPredictions: this.getLatestOperationsSummary(data.predictions),
                    latestPayments: this.getLatestOperationsSummary(data.payments)
                },
                todayMetrics: {
                    newUsers: data.users.filter(u =>
                        DateHelper.isWithinDateRange(u.createdAt, dateRanges.today)
                    ).length,
                    newPredictions: data.predictions.filter(p =>
                        DateHelper.isWithinDateRange(p.publishedAt, dateRanges.today)
                    ).length,
                    todayRevenue: data.payments
                        .filter(p => p.status === 'SUCCESS' &&
                            DateHelper.isWithinDateRange(p.createdAt, dateRanges.today))
                        .reduce((sum, p) => sum + p.amount, 0),
                    todayRevenueCount: data.payments
                        .filter(p => p.status === 'SUCCESS' &&
                            DateHelper.isWithinDateRange(p.createdAt, dateRanges.today)).length,
                    todayRevenueGrowth: this.calculateTodayRevenueGrowth(data.payments),
                    // Additional today metrics
                    todayActiveUsers: data.users.filter(u => 
                        u.predictions.some(p => DateHelper.isWithinDateRange(p.createdAt, dateRanges.today))
                    ).length,
                    todayEngagement: this.calculateTodayEngagement(data, dateRanges.today),
                    todayPredictionAccuracy: this.calculateTodayPredictionAccuracy(data.predictions, dateRanges.today),
                    todaySubscriptions: data.subscriptions.filter(s =>
                        DateHelper.isWithinDateRange(s.createdAt, dateRanges.today)
                    ).length
                },
                trends: {
                    userGrowth: UserAnalytics.getUserMetrics(data.users, dateRanges.last30Days),
                    predictionPerformance: PredictionAnalytics.getPredictionMetrics(data.predictions, dateRanges.last30Days),
                    revenueMetrics: RevenueAnalytics.getRevenueMetrics(
                        data.payments,
                        data.subscriptions,
                        data.users,
                        dateRanges.last30Days
                    ),
                    // Additional advanced trends
                    weeklyTrends: this.getWeeklyTrends(data),
                    engagementTrends: this.getEngagementTrends(data, dateRanges.last30Days)
                },
                // New advanced analytics section
                advanced: {
                    demographics: advancedMetrics.demographics,
                    behaviorPatterns: advancedMetrics.behaviorPatterns,
                    predictionInsights: advancedMetrics.predictionInsights,
                    revenueBreakdown: advancedMetrics.revenueBreakdown,
                    cohortAnalysis: advancedMetrics.cohortAnalysis,
                    churnAnalysis: advancedMetrics.churnAnalysis,
                    seasonalTrends: advancedMetrics.seasonalTrends
                },
                // Real-time metrics
                realTime: {
                    onlineUsers: Math.floor(Math.random() * data.users.length * 0.1) + 1, // Simulate online users
                    activeSessions: Math.floor(Math.random() * data.users.length * 0.05) + 1,
                    liveMatches: data.predictions.filter(p => p.result === 'PENDING').length,
                    systemLoad: Math.random() * 100
                }
            };
        }
        catch (error) {
            console.error("Error generating dashboard summary:", error);
            return null;
        }
    }

    // Growth rate calculation methods
    private static calculateUserGrowthRate(users: UserWithRelations[]): number {
        const now = new Date();
        const thisMonth = users.filter(u => 
            u.createdAt.getMonth() === now.getMonth() && 
            u.createdAt.getFullYear() === now.getFullYear()
        ).length;
        const lastMonth = users.filter(u => {
            const lastMonthDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
            return u.createdAt.getMonth() === lastMonthDate.getMonth() && 
                   u.createdAt.getFullYear() === lastMonthDate.getFullYear();
        }).length;

        return lastMonth > 0 ? ((thisMonth - lastMonth) / lastMonth) * 100 : thisMonth > 0 ? 100 : 0;
    }

    private static calculatePredictionGrowthRate(predictions: PredictionWithRelations[]): number {
        const now = new Date();
        const thisMonth = predictions.filter(p => 
            p.createdAt.getMonth() === now.getMonth() && 
            p.createdAt.getFullYear() === now.getFullYear()
        ).length;
        const lastMonth = predictions.filter(p => {
            const lastMonthDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
            return p.createdAt.getMonth() === lastMonthDate.getMonth() && 
                   p.createdAt.getFullYear() === lastMonthDate.getFullYear();
        }).length;

        return lastMonth > 0 ? ((thisMonth - lastMonth) / lastMonth) * 100 : thisMonth > 0 ? 100 : 0;
    }

    private static calculateSubscriptionGrowthRate(subscriptions: Subscription[]): number {
        
        const now = new Date();
        const thisMonth = subscriptions.filter(s => 
            s.createdAt.getMonth() === now.getMonth() && 
            s.createdAt.getFullYear() === now.getFullYear()
        ).length;
        const lastMonth = subscriptions.filter(s => {
            const lastMonthDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
            return s.createdAt.getMonth() === lastMonthDate.getMonth() && 
                   s.createdAt.getFullYear() === lastMonthDate.getFullYear();
        }).length;

        return lastMonth > 0 ? ((thisMonth - lastMonth) / lastMonth) * 100 : thisMonth > 0 ? 100 : 0;
    }

    private static calculateTodayRevenueGrowth(payments: Payment[]): number {
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);
        
        const todayRevenue = payments.filter(p => 
            p.status === 'SUCCESS' && 
            p.createdAt >= today
        ).reduce((sum, p) => sum + p.amount, 0);
        
        const yesterdayRevenue = payments.filter(p => 
            p.status === 'SUCCESS' && 
            p.createdAt >= yesterday && 
            p.createdAt < today
        ).reduce((sum, p) => sum + p.amount, 0);

        return yesterdayRevenue > 0 ? ((todayRevenue - yesterdayRevenue) / yesterdayRevenue) * 100 : todayRevenue > 0 ? 100 : 0;
    }

    private static calculateTodayPredictionAccuracy(predictions: PredictionWithRelations[], todayRange: DateRange): number {
        const todayPredictions = predictions.filter(p => 
            DateHelper.isWithinDateRange(p.createdAt, todayRange) && 
            (p.result === 'WON' || p.result === 'LOST')
        );
        const wonPredictions = todayPredictions.filter(p => p.result === 'WON');
        
        return todayPredictions.length > 0 ? (wonPredictions.length / todayPredictions.length) * 100 : 0;
    }

    private static calculateTodayEngagement(data: {
        users: UserWithRelations[];
        predictions: PredictionWithRelations[];
    }, todayRange: DateRange): number {
        const todayViews = data.predictions.reduce((sum, item) => 
            sum + item.View.filter((v: View) => DateHelper.isWithinDateRange(v.createdAt, todayRange)).length, 0
        );
        const todayLikes = data.predictions.reduce((sum, item) => 
            sum + item.Like.filter((l: Like) => DateHelper.isWithinDateRange(l.createdAt, todayRange)).length, 0
        );
        const todayComments = data.predictions.reduce((sum, item) => 
            sum + item.Comment.filter((c: Comment) => DateHelper.isWithinDateRange(c.createdAt, todayRange)).length, 0
        );
        
        return todayViews + todayLikes + todayComments;
    }

    private static getWeeklyTrends(data: {
        users: UserWithRelations[];
        predictions: PredictionWithRelations[];
        payments: Payment[];
    }) {
        const last7Days = Array.from({ length: 7 }, (_, i) => {
            const date = new Date();
            date.setDate(date.getDate() - i);
            return date;
        }).reverse();

        return last7Days.map(date => {
            const dayStart = new Date(date.getFullYear(), date.getMonth(), date.getDate());
            const dayEnd = new Date(dayStart.getTime() + 24 * 60 * 60 * 1000 - 1);
            const dayRange = { startDate: dayStart, endDate: dayEnd };

            return {
                date: date.toISOString().split('T')[0],
                users: data.users.filter(u => DateHelper.isWithinDateRange(u.createdAt, dayRange)).length,
                predictions: data.predictions.filter(p => DateHelper.isWithinDateRange(p.createdAt, dayRange)).length,
                revenue: data.payments
                    .filter(p => p.status === 'SUCCESS' && DateHelper.isWithinDateRange(p.createdAt, dayRange))
                    .reduce((sum, p) => sum + p.amount, 0)
            };
        });
    }

    private static getEngagementTrends(data: {
        predictions: PredictionWithRelations[];
    }, dateRange: DateRange) {
        const allContent = data.predictions;
        const engagementData = allContent.map(item => {
            const views = item.View.filter((v: View) => DateHelper.isWithinDateRange(v.createdAt, dateRange)).length;
            const likes = item.Like.filter((l: Like) => DateHelper.isWithinDateRange(l.createdAt, dateRange)).length;
            const comments = item.Comment.filter((c: Comment) => DateHelper.isWithinDateRange(c.createdAt, dateRange)).length;
            const shares = item.Share.filter((s: Share) => DateHelper.isWithinDateRange(s.createdAt, dateRange)).length;
            
            return {
                totalEngagement: views + likes + comments + shares,
                views,
                likes,
                comments,
                shares
            };
        });

        return {
            totalEngagement: engagementData.reduce((sum, item) => sum + item.totalEngagement, 0),
            averageEngagement: engagementData.length > 0 ? 
                StatisticsHelper.calculateMean(engagementData.map(item => item.totalEngagement)) : 0,
            engagementBreakdown: {
                views: engagementData.reduce((sum, item) => sum + item.views, 0),
                likes: engagementData.reduce((sum, item) => sum + item.likes, 0),
                comments: engagementData.reduce((sum, item) => sum + item.comments, 0),
                shares: engagementData.reduce((sum, item) => sum + item.shares, 0)
            }
        };
    }
}
// ============= ADVANCED FILTERING AND SORTING =============

export class DataProcessor {
    static filterByDateRange<T extends { createdAt: Date }>(
        items: T[],
        range: DateRange
    ): T[] {
        return items.filter(item => DateHelper.isWithinDateRange(item.createdAt, range));
    }

    static sortByField<T>(
        items: T[],
        field: keyof T,
        direction: 'asc' | 'desc' = 'desc'
    ): T[] {
        return [...items].sort((a, b) => {
            const aVal = a[field];
            const bVal = b[field];

            if (aVal < bVal) return direction === 'asc' ? -1 : 1;
            if (aVal > bVal) return direction === 'asc' ? 1 : -1;
            return 0;
        });
    }

    static groupBy<T>(items: T[], keyFunction: (item: T) => string): { [key: string]: T[] } {
        return items.reduce((groups, item) => {
            const key = keyFunction(item);
            if (!groups[key]) groups[key] = [];
            groups[key].push(item);
            return groups;
        }, {} as { [key: string]: T[] });
    }

    static paginate<T>(items: T[], page: number, limit: number): {
        data: T[];
        pagination: {
            currentPage: number;
            totalPages: number;
            totalItems: number;
            hasNextPage: boolean;
            hasPreviousPage: boolean;
        };
    } {
        const totalItems = items.length;
        const totalPages = Math.ceil(totalItems / limit);
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;

        return {
            data: items.slice(startIndex, endIndex),
            pagination: {
                currentPage: page,
                totalPages,
                totalItems,
                hasNextPage: page < totalPages,
                hasPreviousPage: page > 1
            }
        };
    }
}

// ============= EXPORT ALL ANALYTICS =============

export const Analytics = {
    Statistics: StatisticsHelper,
    Date: DateHelper,
    User: UserAnalytics,
    Prediction: PredictionAnalytics,
    Revenue: RevenueAnalytics,
    Performance: PerformanceAnalytics,
    Advanced: AdvancedAnalytics,
    Summary: SummaryAnalytics,
    DataProcessor
};

export default Analytics;