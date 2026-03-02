"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { signOut } from "@/lib/user-actions";
import { createClient } from "@/lib/supabase/client";

import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";

import {
  Tag,
  Flex,
  Menu,
  Button,
  Layout,
  Tooltip,
  Divider,
  Breadcrumb,
  BreadcrumbProps,
} from "antd";

import {
  MdToll,
  MdWallet,
  MdLogout,
  MdHistory,
  MdSettings,
  MdAnalytics,
  MdDashboard,
  MdAutoFixHigh,
} from "react-icons/md";
import { User } from "@supabase/supabase-js";
import UserDropdown from "@/components/UserDropdown";

const { Header, Sider, Content } = Layout;

type MenuRoutes = {
  key: string;
  icon: React.ReactNode;
  label: React.ReactNode;
  onClick?: () => void; // <-- add this since you use onClick in secondaryRoutes
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = useMemo(() => createClient(), []);
  const [user, setUser] = useState<User | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);

  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  const mainRoutes: MenuRoutes[] = useMemo(
    () => [
      { key: "/dashboard", icon: <MdDashboard />, label: <Link href="/dashboard">Dashboard</Link> },
      { key: "/dashboard/analytics", icon: <MdAnalytics />, label: <Link href="/dashboard/analytics">Analytics</Link> },
      { key: "/dashboard/history", icon: <MdHistory />, label: <Link href="/dashboard/history">History</Link> },
      { key: "/dashboard/billing", icon: <MdWallet />, label: <Link href="/dashboard/billing">Buy tokens</Link> },
    ],
    []
  );

  const secondaryRoutes: MenuRoutes[] = useMemo(
    () => [
      { key: "/settings", icon: <MdSettings />, label: <Link href="/settings/profile">Settings</Link> },
      { key: "/logout", icon: <MdLogout />, label: <span>Logout</span>, onClick: () => signOut() },
    ],
    []
  );

  const selectedKeys = useMemo(() => {
    const allRoutes = [...mainRoutes, ...secondaryRoutes];

    const match = allRoutes
      .map((i) => i.key)
      .sort((a, b) => b.length - a.length)
      .find((key) => pathname === key || pathname.startsWith(key + "/"));

    return match ? [match] : [];
  }, [pathname, mainRoutes, secondaryRoutes]);

  const breadcrumbMap = useMemo<Record<string, BreadcrumbProps["items"]>>(
    () => ({
      "/dashboard": [{ title: "Dashboard" }],
      "/dashboard/analytics": [{ title: <Link href="/dashboard">Dashboard</Link> }, { title: "Analytics" }],
      "/dashboard/history": [{ title: <Link href="/dashboard">Dashboard</Link> }, { title: "History" }],
      "/dashboard/billing": [{ title: <Link href="/dashboard">Dashboard</Link> }, { title: "Buy tokens" }],
    }),
    []
  );

  const breadcrumbItems = useMemo(() => {
    const keys = Object.keys(breadcrumbMap).sort((a, b) => b.length - a.length);
    const match = keys.find((k) => pathname === k || pathname.startsWith(k + "/"));
    return match ? breadcrumbMap[match] : [{ title: "Dashboard" }];
  }, [pathname, breadcrumbMap]);

  useEffect(() => {
    let mounted = true;

    (async () => {
      setLoadingUser(true);
      try {
        const { data, error } = await supabase.auth.getUser();
        if (!mounted) return;

        if (error) setUser(null);
        else setUser(data.user);
      } finally {
        if (mounted) setLoadingUser(false);
      }
    })();

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      // optional: show loading briefly if you want
      setLoadingUser(true);
      setUser(session?.user ?? null);
      setLoadingUser(false);
    });

    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, [supabase]);

  return (
    <Layout className="h-screen overflow-hidden">
      <Sider
        className="border-r border-slate-100 dark:border-slate-800"
        theme="light"
        trigger={null}
        collapsible
        collapsed={collapsed}
      >
        <div className="flex h-full flex-col">
          <div className="h-16 flex items-center px-4">
            <Tooltip title={collapsed ? "BannerScoreAI" : ""} placement="right">
              <Link href="/dashboard" className="w-full">
                <div
                  className={[
                    "flex items-center gap-2 text-primary font-bold text-xl w-full",
                    collapsed ? "justify-center" : "justify-start",
                  ].join(" ")}
                >
                  <MdAutoFixHigh className="text-2xl shrink-0" />
                  {!collapsed && <span className="whitespace-nowrap">BannerScoreAI</span>}
                </div>
              </Link>
            </Tooltip>
          </div>

          <Menu
            className="border-0!"
            theme="light"
            mode="inline"
            selectedKeys={selectedKeys}
            items={mainRoutes}
          />

          <div className="mt-auto">
            <div className="mx-2 my-2 border-t border-slate-100 dark:border-slate-800" />
            <Menu
              className="border-0!"
              theme="light"
              mode="inline"
              selectedKeys={selectedKeys}
              items={secondaryRoutes}
            />
          </div>
        </div>
      </Sider>

      <Layout className="min-h-0!">
        <Header className="pr-4! border-b border-slate-100 dark:border-slate-800 bg-white! dark:bg-background-dark! p-0!">
          <Flex align="center" justify="space-between" className="max-w-7xl w-full mx-auto!">
            <Flex align="center" gap={16}>
              <Button
                type="text"
                icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                onClick={() => setCollapsed((v) => !v)}
                style={{ fontSize: 16, width: 64, height: 64 }}
                className="hover:bg-transparent! dark:hover:bg-transparent!"
              />
              <Breadcrumb items={breadcrumbItems} />
            </Flex>

            <Flex align="center">
              <Tag className="rounded-full! sm:inline-flex items-center px-3! py-0.5! font-semibold text-sm! border border-primary/20! bg-primary/10! text-primary!">
                <Flex align="center" gap={2}>
                  <MdToll className="text-base" />
                  <span className=" border-primary/20">tokens</span>
                </Flex>
              </Tag>

              <Divider orientation="vertical" />

              <UserDropdown isLoading={loadingUser} username={user?.user_metadata.name} />
            </Flex>
          </Flex>
        </Header>

        <Content className="p-4 max-w-7xl w-full mx-auto overflow-y-auto">{children}</Content>
      </Layout>
    </Layout>
  );
}