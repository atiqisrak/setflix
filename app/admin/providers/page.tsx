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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Search, Edit, Trash2, Plus, Power, Server } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Provider {
  id: string;
  name: string;
  url: string;
  type: string;
  region: string | null;
  enabled: boolean;
  priority: number;
  healthStatus: string | null;
  channelCount: number | null;
  responseTime: number | null;
  successRate: number | null;
  consecutiveFailures: number;
}

export default function AdminProvidersPage() {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(null);
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    url: "",
    type: "main",
    region: "",
    enabled: true,
    priority: 100,
  });

  useEffect(() => {
    fetchProviders();
  }, [search]);

  const fetchProviders = async () => {
    try {
      setLoading(true);
      const response = await adminApi.providers.list({
        search: search || undefined,
      });
      setProviders(response.providers || []);
    } catch (error) {
      console.error("Failed to fetch providers:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setFormData({
      id: "",
      name: "",
      url: "",
      type: "main",
      region: "",
      enabled: true,
      priority: 100,
    });
    setIsCreateDialogOpen(true);
  };

  const handleEdit = (provider: Provider) => {
    setSelectedProvider(provider);
    setFormData({
      id: provider.id,
      name: provider.name,
      url: provider.url,
      type: provider.type,
      region: provider.region || "",
      enabled: provider.enabled,
      priority: provider.priority,
    });
    setIsEditDialogOpen(true);
  };

  const handleSubmit = async () => {
    try {
      if (isCreateDialogOpen) {
        await adminApi.providers.create(formData);
        setIsCreateDialogOpen(false);
      } else {
        await adminApi.providers.update(selectedProvider!.id, formData);
        setIsEditDialogOpen(false);
      }
      fetchProviders();
      setFormData({
        id: "",
        name: "",
        url: "",
        type: "main",
        region: "",
        enabled: true,
        priority: 100,
      });
    } catch (error: any) {
      alert(`Failed to ${isCreateDialogOpen ? "create" : "update"} provider: ${error?.error || "Unknown error"}`);
    }
  };

  const handleToggle = async (providerId: string) => {
    try {
      await adminApi.providers.toggle(providerId);
      fetchProviders();
    } catch (error: any) {
      alert(`Failed to toggle provider: ${error?.error || "Unknown error"}`);
    }
  };

  const handleDelete = async (providerId: string) => {
    if (!confirm("Are you sure you want to delete this provider?")) return;
    try {
      await adminApi.providers.delete(providerId);
      fetchProviders();
    } catch (error: any) {
      alert(`Failed to delete provider: ${error?.error || "Unknown error"}`);
    }
  };

  const getHealthStatusColor = (status: string | null) => {
    if (status === "online") return "text-green-500";
    if (status === "offline") return "text-red-500";
    return "text-foreground/60";
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-foreground">Provider Management</h2>
        <Button onClick={handleCreate}>
          <Plus size={16} className="mr-2" />
          Add Provider
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Providers</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-foreground/60" />
              <Input
                placeholder="Search providers..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {loading ? (
            <div className="text-center py-8 text-foreground/60">Loading...</div>
          ) : providers.length === 0 ? (
            <div className="text-center py-8 text-foreground/60">No providers found</div>
          ) : (
            <div className="rounded-md border border-border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>URL</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Health</TableHead>
                    <TableHead>Channels</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {providers.map((provider) => (
                    <TableRow key={provider.id}>
                      <TableCell className="font-medium">{provider.name}</TableCell>
                      <TableCell className="text-xs text-foreground/60 truncate max-w-[200px]">
                        {provider.url}
                      </TableCell>
                      <TableCell>{provider.type}</TableCell>
                      <TableCell>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleToggle(provider.id)}
                          className={provider.enabled ? "text-green-500" : "text-foreground/40"}
                        >
                          <Power size={14} className={provider.enabled ? "fill-current" : ""} />
                        </Button>
                      </TableCell>
                      <TableCell>
                        <span className={getHealthStatusColor(provider.healthStatus)}>
                          {provider.healthStatus || "unknown"}
                        </span>
                      </TableCell>
                      <TableCell>{provider.channelCount || 0}</TableCell>
                      <TableCell>{provider.priority}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(provider)}
                          >
                            <Edit size={16} />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(provider.id)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 size={16} />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create/Edit Dialog */}
      <Dialog open={isCreateDialogOpen || isEditDialogOpen} onOpenChange={(open) => {
        setIsCreateDialogOpen(open);
        setIsEditDialogOpen(open);
      }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{isCreateDialogOpen ? "Create Provider" : "Edit Provider"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="id">ID</Label>
              <Input
                id="id"
                value={formData.id}
                onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                disabled={!isCreateDialogOpen}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="url">URL</Label>
              <Input
                id="url"
                type="url"
                value={formData.url}
                onChange={(e) => setFormData({ ...formData, url: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="type">Type</Label>
              <select
                id="type"
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="w-full px-3 py-2 bg-background border border-border rounded text-foreground"
              >
                <option value="main">Main</option>
                <option value="regional">Regional</option>
                <option value="specialty">Specialty</option>
                <option value="third-party">Third Party</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="region">Region</Label>
              <Input
                id="region"
                value={formData.region}
                onChange={(e) => setFormData({ ...formData, region: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              <Input
                id="priority"
                type="number"
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: parseInt(e.target.value) || 100 })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setIsCreateDialogOpen(false);
              setIsEditDialogOpen(false);
            }}>
              Cancel
            </Button>
            <Button onClick={handleSubmit}>
              {isCreateDialogOpen ? "Create" : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
