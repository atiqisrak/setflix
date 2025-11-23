"use client";

import { useEffect, useState } from "react";
import { adminApi } from "@/lib/api/admin";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronDown, ChevronUp, X, Plus } from "lucide-react";

type Theme = 'sports' | 'news' | 'entertainment';

interface ThemeHeroContent {
  images: string[];
  titles: string[];
  descriptions: string[];
}

export default function AdminSettingsPage() {
  const [homepageSettings, setHomepageSettings] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState<Theme>('entertainment');
  const [expandedThemes, setExpandedThemes] = useState<Record<Theme, boolean>>({
    sports: true,
    news: false,
    entertainment: true,
  });
  
  // Store hero content per theme
  const [themeHeroContent, setThemeHeroContent] = useState<Record<Theme, ThemeHeroContent>>({
    sports: { images: [''], titles: [''], descriptions: [''] },
    news: { images: [''], titles: [''], descriptions: [''] },
    entertainment: { images: [''], titles: [''], descriptions: [''] },
  });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setLoading(true);
        const response = await adminApi.settings.getHomepageSettings();
        if (response.settings) {
          setHomepageSettings(response.settings);
          const currentTheme = response.settings.theme || 'entertainment';
          setTheme(currentTheme);
          
          // Initialize theme content from settings
          // If settings have hero content, assign to current theme
          if (response.settings.heroImages && response.settings.heroImages.length > 0) {
            setThemeHeroContent(prev => ({
              ...prev,
              [currentTheme]: {
                images: response.settings.heroImages || [''],
                titles: response.settings.heroTitles || [''],
                descriptions: response.settings.heroDescriptions || [''],
              }
            }));
          }
        }
      } catch (error) {
        console.error('Failed to load homepage settings:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const handleThemeChange = (newTheme: Theme) => {
    setTheme(newTheme);
    setExpandedThemes(prev => ({ ...prev, [newTheme]: true }));
  };

  const toggleThemeExpanded = (themeKey: Theme) => {
    setExpandedThemes(prev => ({ ...prev, [themeKey]: !prev[themeKey] }));
  };

  const updateHeroContent = (
    themeKey: Theme,
    index: number,
    field: 'images' | 'titles' | 'descriptions',
    value: string
  ) => {
    setThemeHeroContent(prev => {
      const newContent = { ...prev[themeKey] };
      const newArray = [...newContent[field]];
      newArray[index] = value;
      newContent[field] = newArray;
      return { ...prev, [themeKey]: newContent };
    });
  };

  const addHeroSlide = (themeKey: Theme) => {
    setThemeHeroContent(prev => {
      const content = prev[themeKey];
      return {
        ...prev,
        [themeKey]: {
          images: [...content.images, ''],
          titles: [...content.titles, ''],
          descriptions: [...content.descriptions, ''],
        }
      };
    });
  };

  const removeHeroSlide = (themeKey: Theme, index: number) => {
    setThemeHeroContent(prev => {
      const content = prev[themeKey];
      return {
        ...prev,
        [themeKey]: {
          images: content.images.filter((_, i) => i !== index),
          titles: content.titles.filter((_, i) => i !== index),
          descriptions: content.descriptions.filter((_, i) => i !== index),
        }
      };
    });
  };

  const handleSave = async () => {
    try {
      const currentContent = themeHeroContent[theme];
      await adminApi.settings.updateHomepageSettings({
        theme,
        heroImages: currentContent.images,
        heroTitles: currentContent.titles,
        heroDescriptions: currentContent.descriptions,
      });
      alert('Homepage settings updated successfully!');
    } catch (error: any) {
      alert(`Failed to update settings: ${error?.error || 'Unknown error'}`);
    }
  };

  if (loading) {
    return <div className="text-foreground/60">Loading settings...</div>;
  }

  const themes: { key: Theme; label: string; description: string }[] = [
    { key: 'sports', label: 'Sports', description: 'Perfect for sports channels and live events' },
    { key: 'news', label: 'News', description: 'Ideal for news channels and breaking news' },
    { key: 'entertainment', label: 'Entertainment', description: 'Great for movies, shows, and entertainment content' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-foreground mb-2">System Settings</h2>
        <p className="text-foreground/60">Manage homepage theme and hero section content</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Homepage Theme Settings</CardTitle>
          <CardDescription>Select the active theme and configure hero section content for each theme</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="theme">Active Theme</Label>
            <select
              id="theme"
              value={theme}
              onChange={(e) => handleThemeChange(e.target.value as Theme)}
              className="w-full px-3 py-2 bg-background border border-border rounded text-foreground"
            >
              {themes.map((t) => (
                <option key={t.key} value={t.key}>{t.label}</option>
              ))}
            </select>
            <p className="text-sm text-foreground/60 mt-1">
              The selected theme will be displayed on the homepage. Configure hero content for each theme below.
            </p>
          </div>

          <div className="space-y-4">
            <Label className="text-lg font-semibold">Hero Section Content by Theme</Label>
            <p className="text-sm text-foreground/60 mb-4">
              Manage hero section slides for each theme. Content will automatically switch when the theme changes.
            </p>
            
            {themes.map((themeOption) => {
              const content = themeHeroContent[themeOption.key];
              const isExpanded = expandedThemes[themeOption.key];
              const isActive = theme === themeOption.key;

              return (
                <Card key={themeOption.key} className={`border-2 ${isActive ? 'border-accent' : 'border-border'}`}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div>
                          <CardTitle className="text-lg flex items-center gap-2">
                            {themeOption.label}
                            {isActive && (
                              <span className="text-xs px-2 py-1 bg-accent text-accent-foreground rounded-full">
                                Active
                              </span>
                            )}
                          </CardTitle>
                          <CardDescription className="text-sm mt-1">
                            {themeOption.description}
                          </CardDescription>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleThemeExpanded(themeOption.key)}
                        className="h-8 w-8 p-0"
                      >
                        {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                      </Button>
                    </div>
                  </CardHeader>
                  
                  {isExpanded && (
                    <CardContent className="space-y-4 pt-0">
                      {content.images.map((image, index) => (
                        <div key={index} className="p-4 border border-border rounded-lg space-y-3 bg-background/50">
                          <div className="flex items-center justify-between mb-2">
                            <Label className="text-sm font-semibold">Slide {index + 1}</Label>
                            {content.images.length > 1 && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => removeHeroSlide(themeOption.key, index)}
                                className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                              >
                                <X size={16} />
                              </Button>
                            )}
                          </div>
                          
                          <div className="space-y-3">
                            <div>
                              <Label htmlFor={`${themeOption.key}-image-${index}`} className="text-sm">
                                Image URL
                              </Label>
                              <Input
                                id={`${themeOption.key}-image-${index}`}
                                value={image}
                                onChange={(e) => updateHeroContent(themeOption.key, index, 'images', e.target.value)}
                                placeholder="https://example.com/image.jpg"
                                className="mt-1"
                              />
                              {image && (
                                <div className="mt-2 rounded overflow-hidden border border-border max-w-xs">
                                  <img
                                    src={image}
                                    alt={`Preview ${index + 1}`}
                                    className="w-full h-32 object-cover"
                                    onError={(e) => {
                                      (e.target as HTMLImageElement).style.display = 'none';
                                    }}
                                  />
                                </div>
                              )}
                            </div>
                            
                            <div>
                              <Label htmlFor={`${themeOption.key}-title-${index}`} className="text-sm">
                                Title
                              </Label>
                              <Input
                                id={`${themeOption.key}-title-${index}`}
                                value={content.titles[index] || ''}
                                onChange={(e) => updateHeroContent(themeOption.key, index, 'titles', e.target.value)}
                                placeholder="Enter hero title"
                                className="mt-1"
                              />
                            </div>
                            
                            <div>
                              <Label htmlFor={`${themeOption.key}-description-${index}`} className="text-sm">
                                Description
                              </Label>
                              <textarea
                                id={`${themeOption.key}-description-${index}`}
                                value={content.descriptions[index] || ''}
                                onChange={(e) => updateHeroContent(themeOption.key, index, 'descriptions', e.target.value)}
                                placeholder="Enter hero description"
                                className="mt-1 w-full px-3 py-2 bg-background border border-border rounded text-foreground min-h-[80px] resize-y"
                                rows={3}
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                      
                      <Button
                        variant="outline"
                        onClick={() => addHeroSlide(themeOption.key)}
                        className="w-full"
                      >
                        <Plus size={16} className="mr-2" />
                        Add Hero Slide
                      </Button>
                    </CardContent>
                  )}
                </Card>
              );
            })}
          </div>

          <div className="pt-4 border-t border-border">
            <Button onClick={handleSave} className="w-full" size="lg">
              Save Settings
            </Button>
            <p className="text-xs text-foreground/60 mt-2 text-center">
              This will save the active theme and all hero content configurations
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

