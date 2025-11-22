"use client";

import { useEffect, useState } from "react";
import { adminApi } from "@/lib/api/admin";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminSettingsPage() {
  const [homepageSettings, setHomepageSettings] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState<'sports' | 'news' | 'entertainment'>('entertainment');
  const [heroImages, setHeroImages] = useState<string[]>(['']);
  const [heroTitles, setHeroTitles] = useState<string[]>(['']);
  const [heroDescriptions, setHeroDescriptions] = useState<string[]>(['']);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setLoading(true);
        const response = await adminApi.settings.getHomepageSettings();
        if (response.settings) {
          setHomepageSettings(response.settings);
          setTheme(response.settings.theme);
          setHeroImages(response.settings.heroImages || ['']);
          setHeroTitles(response.settings.heroTitles || ['']);
          setHeroDescriptions(response.settings.heroDescriptions || ['']);
        }
      } catch (error) {
        console.error('Failed to load homepage settings:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const handleSave = async () => {
    try {
      await adminApi.settings.updateHomepageSettings({
        theme,
        heroImages,
        heroTitles,
        heroDescriptions,
      });
      alert('Homepage settings updated successfully!');
    } catch (error: any) {
      alert(`Failed to update settings: ${error?.error || 'Unknown error'}`);
    }
  };

  if (loading) {
    return <div className="text-foreground/60">Loading settings...</div>;
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-foreground mb-2">System Settings</h2>
        <p className="text-foreground/60">Manage homepage theme and hero section</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Homepage Theme Settings</CardTitle>
          <CardDescription>Configure the homepage theme and hero section images</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="theme">Theme</Label>
            <select
              id="theme"
              value={theme}
              onChange={(e) => setTheme(e.target.value as 'sports' | 'news' | 'entertainment')}
              className="w-full px-3 py-2 bg-background border border-border rounded text-foreground"
            >
              <option value="sports">Sports</option>
              <option value="news">News</option>
              <option value="entertainment">Entertainment</option>
            </select>
          </div>

          <div className="space-y-4">
            <Label>Hero Section Content</Label>
            {heroImages.map((image, index) => (
              <div key={index} className="p-4 border border-border rounded space-y-2">
                <div>
                  <Label>Image URL</Label>
                  <Input
                    value={image}
                    onChange={(e) => {
                      const newImages = [...heroImages];
                      newImages[index] = e.target.value;
                      setHeroImages(newImages);
                    }}
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
                <div>
                  <Label>Title</Label>
                  <Input
                    value={heroTitles[index] || ''}
                    onChange={(e) => {
                      const newTitles = [...heroTitles];
                      newTitles[index] = e.target.value;
                      setHeroTitles(newTitles);
                    }}
                    placeholder="Hero title"
                  />
                </div>
                <div>
                  <Label>Description</Label>
                  <Input
                    value={heroDescriptions[index] || ''}
                    onChange={(e) => {
                      const newDescriptions = [...heroDescriptions];
                      newDescriptions[index] = e.target.value;
                      setHeroDescriptions(newDescriptions);
                    }}
                    placeholder="Hero description"
                  />
                </div>
              </div>
            ))}
            <Button
              variant="outline"
              onClick={() => {
                setHeroImages([...heroImages, '']);
                setHeroTitles([...heroTitles, '']);
                setHeroDescriptions([...heroDescriptions, '']);
              }}
            >
              Add Hero Slide
            </Button>
          </div>

          <Button onClick={handleSave} className="w-full">
            Save Settings
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

