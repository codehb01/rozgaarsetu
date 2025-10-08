"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { PlanType, UserRole } from "@prisma/client";

interface UsageStats {
  planType: PlanType;
  planExpiry: Date | null;
  isActive: boolean;
  bookings?: {
    current: number;
    limit: string | number;
    percentage: number;
  };
  leads?: {
    current: number;
    limit: string | number;
    percentage: number;
  };
  completedJobs?: number;
}

interface UsageTrackerProps {
  userRole: UserRole;
  className?: string;
}

export default function UsageTracker({
  userRole,
  className,
}: UsageTrackerProps) {
  const [stats, setStats] = useState<UsageStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsageStats();
  }, []);

  const fetchUsageStats = async () => {
    try {
      const response = await fetch("/api/user/usage-stats");
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error("Failed to fetch usage stats:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>Usage & Plan</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-8 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!stats) {
    return (
      <Card className={className}>
        <CardContent className="pt-6">
          <p className="text-sm text-muted-foreground">
            Unable to load usage data
          </p>
        </CardContent>
      </Card>
    );
  }

  const getPlanBadgeColor = (planType: PlanType) => {
    switch (planType) {
      case PlanType.FREE:
        return "bg-gray-100 text-gray-800";
      case PlanType.BOOST:
        return "bg-blue-100 text-blue-800";
      case PlanType.PRO:
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const shouldShowUpgradePrompt = () => {
    if (stats.planType !== PlanType.FREE) return false;

    if (userRole === UserRole.CUSTOMER && stats.bookings) {
      return stats.bookings.percentage >= 80; // Show when 80% of limit is reached
    }

    if (userRole === UserRole.WORKER && stats.leads) {
      return stats.leads.percentage >= 80;
    }

    return false;
  };

  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-lg font-medium">Usage & Plan</CardTitle>
        <Badge className={getPlanBadgeColor(stats.planType)}>
          {stats.planType.charAt(0) + stats.planType.slice(1).toLowerCase()}
        </Badge>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Customer Usage */}
        {userRole === UserRole.CUSTOMER && stats.bookings && (
          <div>
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-muted-foreground">Monthly Bookings</span>
              <span className="font-medium">
                {stats.bookings.current} / {stats.bookings.limit}
              </span>
            </div>
            <Progress value={stats.bookings.percentage} className="h-2" />
            {stats.bookings.percentage >= 100 && (
              <p className="text-xs text-amber-600 mt-1">
                Monthly limit reached. Upgrade for unlimited bookings.
              </p>
            )}
          </div>
        )}

        {/* Worker Usage */}
        {userRole === UserRole.WORKER && stats.leads && (
          <div className="space-y-3">
            <div>
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-muted-foreground">Monthly Leads</span>
                <span className="font-medium">
                  {stats.leads.current} / {stats.leads.limit}
                </span>
              </div>
              <Progress value={stats.leads.percentage} className="h-2" />
              {stats.leads.percentage >= 100 && (
                <p className="text-xs text-amber-600 mt-1">
                  Monthly limit reached. Upgrade for unlimited leads.
                </p>
              )}
            </div>

            {stats.completedJobs !== undefined && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Jobs Completed</span>
                <span className="font-medium">{stats.completedJobs}</span>
              </div>
            )}
          </div>
        )}

        {/* Plan Expiry */}
        {stats.planExpiry && stats.planType !== PlanType.FREE && (
          <div className="text-xs text-muted-foreground">
            Plan expires: {new Date(stats.planExpiry).toLocaleDateString()}
          </div>
        )}

        {/* Upgrade Prompt */}
        {shouldShowUpgradePrompt() && (
          <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
            <p className="text-sm text-amber-800 mb-2">
              {userRole === UserRole.CUSTOMER
                ? "You're close to your booking limit!"
                : "You're close to your leads limit!"}
            </p>
            <Button asChild size="sm" className="w-full">
              <Link href="/pricing">Upgrade Now</Link>
            </Button>
          </div>
        )}

        {/* Upgrade Button for Free Users */}
        {stats.planType === PlanType.FREE && !shouldShowUpgradePrompt() && (
          <Button asChild variant="outline" size="sm" className="w-full">
            <Link href="/pricing">Upgrade Plan</Link>
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
