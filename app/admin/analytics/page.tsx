"use client";

import { useEffect, useState } from "react";
import { adminApi } from "@/lib/api/admin";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, Users, Tv, Server, Activity } from "lucide-react";

export default function AdminAnalyticsPage() {
  const [overview, setOverview] = useState<any>(null);
  const [userAnalytics, setUserAnalytics] = useState<any>(null);
  const [usageAnalytics, setUsageAnalytics] = useState<any>(null);
  const [providerPerformance, setProviderPerformance] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAllAnalytics();
  }, []);

  const fetchAllAnalytics = async () => {
    try {
      setLoading(true);
      const [overviewRes, userRes, usageRes, providerRes] = await Promise.all([
        adminApi.analytics.getOverview(),
        adminApi.analytics.getUserAnalytics(),
        adminApi.analytics.getUsageAnalytics(),
        adminApi.analytics.getProviderPerformance(),
      ]);
      setOverview(overviewRes.overview);
      setUserAnalytics(userRes.analytics);
      setUsageAnalytics(usageRes.analytics);
      setProviderPerformance(providerRes.performance);
    } catch (error) {
      console.error("Failed to fetch analytics:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-foreground/60">Loading analytics...</div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-foreground mb-2">Analytics Dashboard</h2>
        <p className="text-foreground/60">Platform statistics and insights</p>
      </div>

      {/* Overview Stats */}
      {overview && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-foreground/60">Total Users</CardTitle>
              <Users className="h-4 w-4 text-foreground/60" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{overview.users?.total || 0}</div>
              <p className="text-xs text-foreground/60 mt-1">
                {overview.users?.active || 0} active (30 days)
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-foreground/60">Total Channels</CardTitle>
              <Tv className="h-4 w-4 text-foreground/60" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                {overview.channels?.total || 0}
              </div>
              <p className="text-xs text-foreground/60 mt-1">
                {overview.channels?.active || 0} active
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-foreground/60">Providers</CardTitle>
              <Server className="h-4 w-4 text-foreground/60" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                {overview.providers?.total || 0}
              </div>
              <p className="text-xs text-foreground/60 mt-1">
                {overview.providers?.enabled || 0} enabled
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-foreground/60">Activity</CardTitle>
              <Activity className="h-4 w-4 text-foreground/60" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                {overview.activity?.totalWatchHistory || 0}
              </div>
              <p className="text-xs text-foreground/60 mt-1">
                {overview.activity?.recentAnalytics || 0} events (24h)
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* User Analytics */}
      {userAnalytics && (
        <Card>
          <CardHeader>
            <CardTitle>User Analytics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <div className="text-sm text-foreground/60">Total Users</div>
                <div className="text-2xl font-bold text-foreground">{userAnalytics.total || 0}</div>
              </div>
              <div>
                <div className="text-sm text-foreground/60">New Users (30 days)</div>
                <div className="text-2xl font-bold text-foreground">{userAnalytics.newUsers || 0}</div>
              </div>
              <div>
                <div className="text-sm text-foreground/60">By Role</div>
                <div className="mt-2 space-y-1">
                  {userAnalytics.byRole?.map((role: any) => (
                    <div key={role.role} className="flex justify-between text-sm">
                      <span>{role.role}:</span>
                      <span className="font-medium">{role.count}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Usage Analytics */}
      {usageAnalytics && (
        <Card>
          <CardHeader>
            <CardTitle>Usage Analytics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="text-sm text-foreground/60">Total Watch Time</div>
                <div className="text-2xl font-bold text-foreground">
                  {Math.round((usageAnalytics.totalWatchTime || 0) / 3600)} hours
                </div>
              </div>
              {usageAnalytics.popularChannels && usageAnalytics.popularChannels.length > 0 && (
                <div>
                  <div className="text-sm text-foreground/60 mb-2">Popular Channels</div>
                  <div className="space-y-2">
                    {usageAnalytics.popularChannels.slice(0, 5).map((item: any) => (
                      <div key={item.channelId} className="flex justify-between text-sm">
                        <span>{item.channel?.name || "Unknown"}</span>
                        <span className="font-medium">{item.watchCount} views</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Provider Performance */}
      {providerPerformance && providerPerformance.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Provider Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-2 px-4">Provider</th>
                    <th className="text-left py-2 px-4">Status</th>
                    <th className="text-left py-2 px-4">Channels</th>
                    <th className="text-left py-2 px-4">Success Rate</th>
                    <th className="text-left py-2 px-4">Response Time</th>
                  </tr>
                </thead>
                <tbody>
                  {providerPerformance.map((provider: any) => (
                    <tr key={provider.id} className="border-b border-border">
                      <td className="py-2 px-4 font-medium">{provider.name}</td>
                      <td className="py-2 px-4">
                        <span
                          className={
                            provider.healthStatus === "online"
                              ? "text-green-500"
                              : provider.healthStatus === "offline"
                              ? "text-red-500"
                              : "text-foreground/60"
                          }
                        >
                          {provider.healthStatus || "unknown"}
                        </span>
                      </td>
                      <td className="py-2 px-4">{provider.channelCount || 0}</td>
                      <td className="py-2 px-4">
                        {((provider.successRate || 0) * 100).toFixed(1)}%
                      </td>
                      <td className="py-2 px-4">
                        {provider.responseTime ? `${provider.responseTime}ms` : "-"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
