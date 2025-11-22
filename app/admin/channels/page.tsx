"use client";

import { useEffect, useState } from "react";
import { adminApi } from "@/lib/api/admin";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Search, Edit, Trash2, Filter, Tv } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Channel {
  id: string;
  name: string;
  url: string;
  category: string | null;
  country: string | null;
  isActive: boolean;
  provider: {
    id: string;
    name: string;
  };
}

export default function AdminChannelsPage() {
  const [channels, setChannels] = useState<Channel[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [countryFilter, setCountryFilter] = useState("");
  const [providerFilter, setProviderFilter] = useState("");
  const [total, setTotal] = useState(0);
  const [offset, setOffset] = useState(0);
  const [limit] = useState(50);
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    fetchChannels();
    fetchStats();
  }, [search, categoryFilter, countryFilter, providerFilter, offset]);

  const fetchChannels = async () => {
    try {
      setLoading(true);
      const response = await adminApi.channels.list({
        search: search || undefined,
        category: categoryFilter || undefined,
        country: countryFilter || undefined,
        providerId: providerFilter || undefined,
        limit,
        offset,
      });
      setChannels(response.channels || []);
      setTotal(response.total || 0);
    } catch (error) {
      console.error("Failed to fetch channels:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await adminApi.channels.getStats();
      setStats(response.stats);
    } catch (error) {
      console.error("Failed to fetch stats:", error);
    }
  };

  const handleDelete = async (channelId: string) => {
    if (!confirm("Are you sure you want to delete this channel?")) return;
    try {
      await adminApi.channels.delete(channelId);
      fetchChannels();
      fetchStats();
    } catch (error: any) {
      alert(`Failed to delete channel: ${error?.error || "Unknown error"}`);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-foreground">Channel Management</h2>
      </div>

      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm text-foreground/60">Total Channels</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{stats.totalChannels}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm text-foreground/60">Active Channels</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{stats.activeChannels}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm text-foreground/60">Inactive</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{stats.inactiveChannels}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm text-foreground/60">Categories</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{stats.categoriesCount}</div>
            </CardContent>
          </Card>
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Channels</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4 mb-6">
            <div className="flex-1 min-w-[200px] relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-foreground/60" />
              <Input
                placeholder="Search channels..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <Input
              placeholder="Category filter..."
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="min-w-[150px]"
            />
            <Input
              placeholder="Country filter..."
              value={countryFilter}
              onChange={(e) => setCountryFilter(e.target.value)}
              className="min-w-[150px]"
            />
            <Input
              placeholder="Provider ID..."
              value={providerFilter}
              onChange={(e) => setProviderFilter(e.target.value)}
              className="min-w-[150px]"
            />
          </div>

          {loading ? (
            <div className="text-center py-8 text-foreground/60">Loading...</div>
          ) : channels.length === 0 ? (
            <div className="text-center py-8 text-foreground/60">No channels found</div>
          ) : (
            <>
              <div className="rounded-md border border-border max-h-[600px] overflow-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Country</TableHead>
                      <TableHead>Provider</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {channels.map((channel) => (
                      <TableRow key={channel.id}>
                        <TableCell className="font-medium">{channel.name}</TableCell>
                        <TableCell>{channel.category || "-"}</TableCell>
                        <TableCell>{channel.country || "-"}</TableCell>
                        <TableCell>{channel.provider?.name || "-"}</TableCell>
                        <TableCell>
                          {channel.isActive ? (
                            <span className="text-green-500">Active</span>
                          ) : (
                            <span className="text-foreground/40">Inactive</span>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(channel.id)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 size={16} />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <div className="flex items-center justify-between mt-4">
                <div className="text-sm text-foreground/60">
                  Showing {offset + 1} - {Math.min(offset + limit, total)} of {total}
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    disabled={offset === 0}
                    onClick={() => setOffset(Math.max(0, offset - limit))}
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    disabled={offset + limit >= total}
                    onClick={() => setOffset(offset + limit)}
                  >
                    Next
                  </Button>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
