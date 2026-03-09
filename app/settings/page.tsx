"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { useFamily } from "@/contexts/family-context";
import { ArrowLeft, User, Plus, Pencil, Trash2, ExternalLink, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type SeerrStatus = { connected: boolean; url?: string } | null;

export default function SettingsPage() {
  const { profiles, addProfile, updateProfile, deleteProfile } = useFamily();
  const [seerrStatus, setSeerrStatus] = useState<SeerrStatus>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editAvatarUrl, setEditAvatarUrl] = useState("");
  const [editIsKids, setEditIsKids] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newName, setNewName] = useState("");
  const [newAvatarUrl, setNewAvatarUrl] = useState("");
  const [newIsKids, setNewIsKids] = useState(false);

  useEffect(() => {
    fetch("/api/seerr/status")
      .then((res) => res.json())
      .then((data) => setSeerrStatus({ connected: !!data.connected, url: data.url }))
      .catch(() => setSeerrStatus({ connected: false }));
  }, []);

  const startEdit = (id: string) => {
    const p = profiles.find((x) => x.id === id);
    if (p) {
      setEditingId(id);
      setEditName(p.name);
      setEditAvatarUrl(p.avatarUrl || "");
      setEditIsKids(!!p.isKids);
    }
  };

  const saveEdit = () => {
    if (editingId) {
      updateProfile(editingId, {
        name: editName.trim() || "Profile",
        avatarUrl: editAvatarUrl.trim() || undefined,
        isKids: editIsKids,
      });
      setEditingId(null);
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
  };

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const name = newName.trim();
    if (!name) return;
    addProfile({
      name,
      avatarUrl: newAvatarUrl.trim() || undefined,
      isKids: newIsKids,
    });
    setNewName("");
    setNewAvatarUrl("");
    setNewIsKids(false);
    setShowAddForm(false);
  };

  const handleDelete = (id: string) => {
    if (typeof window !== "undefined" && window.confirm("Remove this profile? Their list will be cleared.")) {
      deleteProfile(id);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-24 px-4 md:px-8 py-12">
        <div className="max-w-2xl mx-auto">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-foreground/60 hover:text-foreground mb-8 transition"
          >
            <ArrowLeft size={18} />
            Back to Home
          </Link>

          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
            Device settings
          </h1>
          <p className="text-foreground/60 mb-8">
            Manage family profiles on this device. Data is stored only on this device.
          </p>

          <section className="bg-card rounded-lg border border-border p-6">
            <h2 className="text-xl font-semibold text-foreground mb-4">
              Family profiles
            </h2>

            <ul className="space-y-4 mb-6">
              {profiles.map((profile) => (
                <li
                  key={profile.id}
                  className="flex items-center justify-between gap-4 p-3 rounded-lg bg-background/50 border border-border"
                >
                  {editingId === profile.id ? (
                    <div className="flex-1 space-y-3">
                      <div>
                        <Label htmlFor="edit-name" className="text-sm">Name</Label>
                        <Input
                          id="edit-name"
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="edit-avatar" className="text-sm">Avatar URL (optional)</Label>
                        <Input
                          id="edit-avatar"
                          type="url"
                          value={editAvatarUrl}
                          onChange={(e) => setEditAvatarUrl(e.target.value)}
                          className="mt-1"
                        />
                      </div>
                      <label className="flex items-center gap-2 text-sm">
                        <input
                          type="checkbox"
                          checked={editIsKids}
                          onChange={(e) => setEditIsKids(e.target.checked)}
                          className="rounded border-input text-accent"
                        />
                        Kids profile
                      </label>
                      <div className="flex gap-2">
                        <Button size="sm" onClick={saveEdit}>Save</Button>
                        <Button size="sm" variant="outline" onClick={cancelEdit}>Cancel</Button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center gap-3 min-w-0">
                        {profile.avatarUrl ? (
                          <img
                            src={profile.avatarUrl}
                            alt=""
                            className="w-10 h-10 rounded object-cover shrink-0"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded bg-accent flex items-center justify-center shrink-0">
                            <User size={20} className="text-accent-foreground" />
                          </div>
                        )}
                        <div className="min-w-0">
                          <span className="font-medium text-foreground block truncate">
                            {profile.name}
                          </span>
                          {profile.isKids && (
                            <span className="text-xs text-foreground/60">Kids</span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          type="button"
                          onClick={() => startEdit(profile.id)}
                          className="p-2 hover:bg-foreground/10 rounded transition"
                          aria-label="Edit"
                        >
                          <Pencil size={18} className="text-foreground" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(profile.id)}
                          className="p-2 hover:bg-destructive/20 rounded transition"
                          aria-label="Delete"
                        >
                          <Trash2 size={18} className="text-destructive" />
                        </button>
                      </div>
                    </>
                  )}
                </li>
              ))}
            </ul>

            {showAddForm ? (
              <form onSubmit={handleAdd} className="space-y-3 p-4 rounded-lg border border-border border-dashed">
                <div>
                  <Label htmlFor="new-name" className="text-sm">Name</Label>
                  <Input
                    id="new-name"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="Profile name"
                    required
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="new-avatar" className="text-sm">Avatar URL (optional)</Label>
                  <Input
                    id="new-avatar"
                    type="url"
                    value={newAvatarUrl}
                    onChange={(e) => setNewAvatarUrl(e.target.value)}
                    placeholder="https://..."
                    className="mt-1"
                  />
                </div>
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={newIsKids}
                    onChange={(e) => setNewIsKids(e.target.checked)}
                    className="rounded border-input text-accent"
                  />
                  Kids profile
                </label>
                <div className="flex gap-2">
                  <Button type="submit" size="sm">Add</Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setShowAddForm(false);
                      setNewName("");
                      setNewAvatarUrl("");
                      setNewIsKids(false);
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            ) : (
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowAddForm(true)}
                className="w-full flex items-center justify-center gap-2"
              >
                <Plus size={18} />
                Add family member
              </Button>
            )}
          </section>

          <section className="mt-8 bg-card rounded-lg border border-border p-6">
            <h2 className="text-xl font-semibold text-foreground mb-2">
              Seerr (content requests)
            </h2>
            <p className="text-foreground/60 text-sm mb-4">
              Seerr manages movie and TV show requests and connects to Plex/Jellyfin and Radarr/Sonarr. Setflix plays content from its own catalog; use Seerr to request new titles.
            </p>
            {seerrStatus === null ? (
              <div className="flex items-center gap-2 text-foreground/60">
                <Loader2 size={18} className="animate-spin" />
                Checking connection…
              </div>
            ) : seerrStatus.connected ? (
              <div className="flex flex-wrap items-center gap-3">
                <span className="inline-flex items-center gap-1.5 text-sm text-green-600 dark:text-green-400">
                  <span className="w-2 h-2 rounded-full bg-green-500" />
                  Connected
                </span>
                <a
                  href={seerrStatus.url || "http://localhost:5055"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-accent hover:underline text-sm"
                >
                  Open Seerr
                  <ExternalLink size={14} />
                </a>
              </div>
            ) : (
              <div className="space-y-2">
                <p className="text-sm text-foreground/60">
                  Seerr is not running or not reachable. Start it with:
                </p>
                <code className="block text-xs bg-muted px-3 py-2 rounded overflow-x-auto">
                  docker compose -f docker/seerr/docker-compose.yaml up -d
                </code>
                <p className="text-xs text-foreground/50">
                  Then open <strong>{seerrStatus.url || "http://localhost:5055"}</strong> to complete setup.
                </p>
              </div>
            )}
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
