
"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import { Button, Layout, Menu, Tooltip } from "antd";

import {
  MdAnalytics,
  MdAutoFixHigh,
  MdDashboard,
  MdHistory,
  MdWallet,
} from "react-icons/md";

const { Header, Sider, Content } = Layout;

type MenuRoutes = {
  key: string;
  icon: React.ReactNode;
  label: React.ReactNode;
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();

  const routes: MenuRoutes[] = useMemo(
    () => [
      {
        key: "/dashboard",
        icon: <MdDashboard />,
        label: <Link href="/dashboard">Dashboard</Link>,
      },
      {
        key: "/dashboard/analytics",
        icon: <MdAnalytics />,
        label: <Link href="/dashboard/analytics">Analytics</Link>,
      },
      {
        key: "/dashboard/history",
        icon: <MdHistory />,
        label: <Link href="/dashboard/history">History</Link>,
      },
      {
        key: "/dashboard/billing",
        icon: <MdWallet />,
        label: <Link href="/dashboard/billing">Buy tokens</Link>,
      },
    ],
    []
  );

  // Pick the best matching key for the current URL (supports nested routes)
  const selectedKeys = useMemo(() => {
    const match = routes
      .map((i) => i.key)
      .sort((a, b) => b.length - a.length) // longest first
      .find((key) => pathname === key || pathname.startsWith(key + "/"));

    return match ? [match] : [];
  }, [pathname, routes]);

  return (
    <Layout className="h-screen overflow-hidden">
      <Sider
        className="border-r border-slate-100 dark:border-slate-800"
        theme="light"
        trigger={null}
        collapsible
        collapsed={collapsed}
      >
        <div className="h-16 flex items-center px-4">
          <Tooltip title={collapsed ? "BannerScoreAI" : ""} placement="right">
            <Link href="/dashboard">
              <div
                className={[
                  "flex items-center gap-2 text-primary font-bold text-xl w-full",
                  collapsed ? "justify-center" : "justify-start",
                ].join(" ")}
              >
                <MdAutoFixHigh className="text-2xl shrink-0" />
                {!collapsed && (
                  <span className="whitespace-nowrap">BannerScoreAI</span>
                )}
              </div>
            </Link>
          </Tooltip>
        </div>

        <Menu
          className="border-0!"
          theme="light"
          mode="inline"
          selectedKeys={selectedKeys}
          items={routes}
        />
      </Sider>

      <Layout className="min-h-0!">
        <Header className="border-b border-slate-100 dark:border-slate-800 bg-white! dark:bg-background-dark! p-0!">
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed((v) => !v)}
            style={{ fontSize: 16, width: 64, height: 64 }}
            className="hover:bg-transparent! dark:hover:bg-transparent!"
          />
        </Header>

        <Content className="min-h-0! overflow-auto!">{children}</Content>
      </Layout>
    </Layout>
  );
}

// old version
// "use client";

// import React, { useState } from "react";
// import {
//   MenuFoldOutlined,
//   MenuUnfoldOutlined,
//   UploadOutlined,
//   UserOutlined,
//   VideoCameraOutlined,
// } from "@ant-design/icons";
// import { Button, Layout, Menu, Tooltip } from "antd";
// import { MdAnalytics, MdAutoFixHigh, MdDashboard, MdHistory, MdWallet } from "react-icons/md";

// const { Header, Sider, Content } = Layout;

// export default function DashboardLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   const [collapsed, setCollapsed] = useState(false);

//   return (
//     <Layout className="h-screen overflow-hidden">
//       <Sider className="border-r border-slate-100 dark:border-slate-800" theme="light" trigger={null} collapsible collapsed={collapsed}>
//         <div className="h-16 flex items-center px-4">
//           <Tooltip title={collapsed ? "BannerScoreAI" : ""} placement="right">
//             <div
//               className={[
//                 "flex items-center gap-2 text-primary font-bold text-xl w-full",
//                 collapsed ? "justify-center" : "justify-start",
//               ].join(" ")}
//             >
//               <MdAutoFixHigh className="text-2xl shrink-0" />
//               {!collapsed && <span className="whitespace-nowrap">BannerScoreAI</span>}
//             </div>
//           </Tooltip>
//         </div>

//         <Menu
//           className="border-0!"
//           theme="light"
//           mode="inline"
//           defaultChecked={true}
//           defaultOpenKeys={["1"]}
//           items={[
//             { key: "1", icon: <MdDashboard />, label: "Dashboard" },
//             { key: "2", icon: <MdAnalytics />, label: "Analytics" },
//             { key: "3", icon: <MdHistory />, label: "History" },
//             { key: "4", icon: <MdWallet/>, label: "Buy tokens" },
//           ]}
//         />
//       </Sider>

//       {/* Main Content */}
//       <Layout className="min-h-0!">
//         <Header className="border-b border-slate-100 dark:border-slate-800 bg-white! dark:bg-background-dark! p-0!">
//           <Button
//             type="text"
//             icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
//             onClick={() => setCollapsed(!collapsed)}
//             style={{ fontSize: '16px', width: 64, height: 64, }}
//             className="hover:bg-transparent! dark:hover:bg-transparent!"
//           />
//         </Header>

//         {/* Scroll happens here */}
//         <Content className="min-h-0! overflow-auto!">
//           {children}
//         </Content>
//       </Layout>
//     </Layout>
//   );
// }
