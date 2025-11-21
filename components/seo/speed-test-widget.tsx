"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Wifi, Download, Upload, Activity } from "lucide-react";

interface SpeedTestWidgetProps {
  className?: string;
}

export default function SpeedTestWidget({
  className = "",
}: SpeedTestWidgetProps) {
  const [isRunning, setIsRunning] = useState(false);
  const [downloadSpeed, setDownloadSpeed] = useState<number | null>(null);
  const [uploadSpeed, setUploadSpeed] = useState<number | null>(null);
  const [ping, setPing] = useState<number | null>(null);

  const runSpeedTest = async () => {
    setIsRunning(true);
    setDownloadSpeed(null);
    setUploadSpeed(null);
    setPing(null);

    // Simulate speed test
    const testDuration = 3000;
    const startTime = Date.now();

    // Simulate ping
    await new Promise((resolve) => setTimeout(resolve, 500));
    setPing(Math.floor(Math.random() * 50) + 10);

    // Simulate download speed
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setDownloadSpeed(Math.floor(Math.random() * 80) + 20);

    // Simulate upload speed
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setUploadSpeed(Math.floor(Math.random() * 40) + 10);

    const remainingTime = testDuration - (Date.now() - startTime);
    if (remainingTime > 0) {
      await new Promise((resolve) => setTimeout(resolve, remainingTime));
    }

    setIsRunning(false);
  };

  return (
    <section className={`py-12 md:py-16 ${className}`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-card border border-border rounded-lg p-8 md:p-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 text-center">
              Internet Speed Test
            </h2>
            <p className="text-foreground/70 text-center mb-8">
              Test your internet connection speed to ensure optimal streaming
              quality
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-background border border-border rounded-lg p-6 text-center">
                <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-4">
                  <Activity className="w-6 h-6 text-accent" />
                </div>
                <div className="text-2xl font-bold text-foreground mb-2">
                  {ping !== null ? `${ping} ms` : "--"}
                </div>
                <div className="text-sm text-foreground/60">Ping</div>
              </div>

              <div className="bg-background border border-border rounded-lg p-6 text-center">
                <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-4">
                  <Download className="w-6 h-6 text-accent" />
                </div>
                <div className="text-2xl font-bold text-foreground mb-2">
                  {downloadSpeed !== null ? `${downloadSpeed} Mbps` : "--"}
                </div>
                <div className="text-sm text-foreground/60">Download</div>
              </div>

              <div className="bg-background border border-border rounded-lg p-6 text-center">
                <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-4">
                  <Upload className="w-6 h-6 text-accent" />
                </div>
                <div className="text-2xl font-bold text-foreground mb-2">
                  {uploadSpeed !== null ? `${uploadSpeed} Mbps` : "--"}
                </div>
                <div className="text-sm text-foreground/60">Upload</div>
              </div>
            </div>

            <button
              onClick={runSpeedTest}
              disabled={isRunning}
              className="w-full md:w-auto mx-auto px-8 py-4 bg-accent text-white rounded-lg font-medium hover:bg-accent/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isRunning ? (
                <>
                  <Wifi className="w-5 h-5 animate-spin" />
                  Testing...
                </>
              ) : (
                <>
                  <Wifi className="w-5 h-5" />
                  Start Speed Test
                </>
              )}
            </button>

            <div className="mt-8 pt-8 border-t border-border">
              <h3 className="font-semibold text-foreground mb-4">
                Recommended Speeds for Streaming
              </h3>
              <div className="space-y-2 text-sm text-foreground/70">
                <p>SD Quality: 3 Mbps</p>
                <p>HD Quality: 5 Mbps</p>
                <p>4K Quality: 25 Mbps</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
