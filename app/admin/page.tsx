"use client";

import { useEffect, useState } from "react";
import { adminApi } from "@/lib/api/admin";
import { Users, Server, Tv, Activity } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminDashboardPage() {
  const [overview, setOverview] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOverview = async () => {
      try {
        setLoading(true);
        const response = await adminApi.analytics.getOverview();
        setOverview(response.overview);
        setError(null);
      } catch (err: any) {
        setError(err?.error || "Failed to load overview");
      } finally {
        setLoading(false);
      }
    };

    fetchOverview();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-foreground/60">Loading dashboard...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-destructive">{error}</div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-foreground mb-2">Dashboard Overview</h2>
        <p className="text-foreground/60">Welcome to the admin dashboard</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-foreground/60">Total Users</CardTitle>
            <Users className="h-4 w-4 text-foreground/60" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{overview?.users?.total || 0}</div>
            <p className="text-xs text-foreground/60 mt-1">
              {overview?.users?.active || 0} active users
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-foreground/60">Total Channels</CardTitle>
            <Tv className="h-4 w-4 text-foreground/60" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{overview?.channels?.total || 0}</div>
            <p className="text-xs text-foreground/60 mt-1">
              {overview?.channels?.active || 0} active channels
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-foreground/60">Providers</CardTitle>
            <Server className="h-4 w-4 text-foreground/60" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{overview?.providers?.total || 0}</div>
            <p className="text-xs text-foreground/60 mt-1">
              {overview?.providers?.enabled || 0} enabled
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
              {overview?.activity?.totalWatchHistory || 0}
            </div>
            <p className="text-xs text-foreground/60 mt-1">
              {overview?.activity?.recentAnalytics || 0} events (24h)
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

