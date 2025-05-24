'use client';

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function DashboardNavigation() {
    const pathname = usePathname();

    return (
        <div id="dashboard-navigation" className="flex flex-col gap-1">
            <Button
                variant="ghost"
                className="justify-start"
                asChild
                disabled={pathname === "/workflows"}
                style={pathname === "/workflows" ? { backgroundColor: "var(--primary-background)" } : undefined}
            >
                <Link href="/workflows">Workflows</Link>
            </Button>
            <Button
                variant="ghost"
                className="justify-start"
                asChild
                disabled={pathname === "/activity"}
                style={pathname === "/activity" ? { backgroundColor: "var(--primary-background)" } : undefined}
            >
                <Link href="/activity">Activity</Link>
            </Button>
            <Button
                variant="ghost"
                className="justify-start"
                asChild
                disabled={pathname === "/connections"}
                style={pathname === "/connections" ? { backgroundColor: "var(--primary-background)" } : undefined}
            >
                <Link href="/connections">Connections</Link>
            </Button>
            <Button
                variant="ghost"
                className="justify-start"
                asChild
                disabled={pathname === "/reusable-data"}
                style={pathname === "/reusable-data" ? { backgroundColor: "var(--primary-background)" } : undefined}
            >
                <Link href="/reusable-data">Reusable data</Link>
            </Button>
        </div>
    );
} 