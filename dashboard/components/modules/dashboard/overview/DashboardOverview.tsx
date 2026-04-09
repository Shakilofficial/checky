/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/set-state-in-effect */

"use client";

import ManageTasks from "@/components/modules/dashboard/tasks/ManageTasks";
import { useUser } from "@/components/providers/UserProvider";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { IAnalyticsData } from "@/types/analytics";
import { IMeta } from "@/types/common";
import { ITask } from "@/types/task";
import { motion, Variants } from "framer-motion";
import {
    Activity,
    CheckCircle2,
    Clock,
    LayoutDashboard,
    ListTodo,
    Plus,
    Users
} from "lucide-react";
import { useEffect, useState } from "react";

interface DashboardOverviewProps {
    data: IAnalyticsData;
    tasks: ITask[];
    tasksMeta: IMeta;
    loading?: boolean;
}

export default function DashboardOverview({ data, tasks, tasksMeta, loading }: DashboardOverviewProps) {
    const { user } = useUser();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (loading) return <DashboardSkeleton />;

    const container: Variants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.05
            }
        }
    };

    const item: Variants = {
        hidden: { opacity: 0, y: 10 },
        show: {
            opacity: 1,
            y: 0,
            transition: { type: "spring", stiffness: 100 }
        }
    };


    return (
        <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="space-y-8 pb-10"
        >
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-foreground bg-clip-text bg-linear-to-r from-primary to-primary/70">
                        Welcome back, {user?.name?.split(' ')[0] || 'User'}
                    </h1>
                    <p className="text-sm font-medium text-muted-foreground/90 mt-1">
                        Here&apos;s what&apos;s happening with your projects today.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="outline" size="sm" className="hidden sm:flex border-primary/20 hover:bg-primary/10 transition-colors rounded-xl">
                        <Clock className="mr-2 h-4 w-4 text-primary" />
                        History
                    </Button>
                    <Button size="sm" className="bg-primary text-primary-foreground shadow-lg shadow-primary/30 border-0 hover:scale-[1.02] active:scale-95 transition-all rounded-xl">
                        <Plus className="mr-2 h-4 w-4" />
                        Quick Task
                    </Button>
                </div>
            </div>

            {/* Metrics Overview */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <MiniMetric
                    label="Total Tasks"
                    value={data?.totals?.tasks || 0}
                    icon={<ListTodo className="h-4 w-4" />}
                    color="primary"
                    variants={item}
                />
                <MiniMetric
                    label="Active Users"
                    value={data?.totals?.users || 0}
                    icon={<Users className="h-4 w-4" />}
                    color="secondary"
                    variants={item}
                />
                <MiniMetric
                    label="Audit Logs"
                    value={data?.totals?.auditLogs || 0}
                    icon={<LayoutDashboard className="h-4 w-4" />}
                    color="primary"
                    variants={item}
                />
                <MiniMetric
                    label="Completed"
                    value={data?.highlights?.completedTasks || 0}
                    icon={<CheckCircle2 className="h-4 w-4" />}
                    color="secondary"
                    variants={item}
                />
            </div>

            {/* Main Content Area */}
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
                {/* Task Management Section - The Core */}
                <motion.div
                    variants={item}
                    className="xl:col-span-12"
                >
                    <div className="bg-card rounded-3xl border border-border/50 shadow-sm overflow-hidden min-h-[500px]">
                        <div className="p-6 border-b border-border/50 flex items-center justify-between bg-muted/20">
                            <div>
                                <h3 className="text-lg font-bold flex items-center gap-2">
                                    <Activity className="h-5 w-5 text-primary" />
                                    Active Task Registry
                                </h3>
                                <p className="text-xs text-muted-foreground uppercase tracking-widest font-medium mt-0.5">
                                    Manage and track progress
                                </p>
                            </div>
                        </div>
                        <div className="p-6">
                            <ManageTasks data={tasks} meta={tasksMeta} />
                        </div>
                    </div>
                </motion.div>
            </div>
        </motion.div>
    );
}

function MiniMetric({ label, value, icon, color, variants }: { label: string; value: number | string; icon: React.ReactNode; color: "primary" | "secondary"; variants: Variants }) {
    const accents = {
        primary: "bg-primary/10 text-primary border border-primary/20",
        secondary: "bg-primary/10 text-primary border border-primary/20",
    };

    return (
        <motion.div
            variants={variants}
            className="bg-card p-5 rounded-3xl border border-border/60 shadow-sm flex items-center gap-4 group hover:border-primary/40 hover:shadow-md transition-all duration-300"
        >
            <div className={cn("h-11 w-11 rounded-2xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110", accents[color])}>
                {icon}
            </div>
            <div>
                <p className="text-[11px] font-bold text-muted-foreground/80 uppercase tracking-widest">{label}</p>
                <p className="text-2xl font-extrabold tabular-nums tracking-tight">{value.toLocaleString()}</p>
            </div>
        </motion.div>
    );
}

export function DashboardSkeleton() {
    return (
        <div className="space-y-8 pb-10 animate-pulse">
            <div className="flex justify-between items-center">
                <div className="space-y-2">
                    <div className="h-8 w-64 bg-muted rounded-lg" />
                    <div className="h-4 w-48 bg-muted rounded-lg" />
                </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[1, 2, 3, 4].map(i => <div key={i} className="h-24 bg-card rounded-3xl border border-border/50" />)}
            </div>
            <div className="h-[600px] bg-card rounded-3xl border border-border/50" />
        </div>
    );
}
