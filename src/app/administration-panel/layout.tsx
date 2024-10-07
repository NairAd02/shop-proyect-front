
"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/sidebar";
import { DashboardAdministrationPanel } from "@/components/dashboard-administration-panel";
import { Logo, LogoIcon } from "@/components/logo";
import { findChildrensRoute, routes } from "@/routes/routes";
import { usePathname, useRouter } from "next/navigation";
import Header from "@/components/header";
import { useAuth } from "@/hooks/useAuth";




export default function SidebarDemo({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const [isActive, setIsActive] = useState(false)
  // se protege la página
  useAuth(() => {
    setIsActive(true) // si se completó la verificación entonces se muesta la página
  })
    const [routesSideBar, setRoutesSideBar] = useState(findChildrensRoute('/administration-panel'))
    const pathName = usePathname()
    const [open, setOpen] = useState(false);

    return (
        <>
        {isActive ? <div
            className={cn(
                "rounded-md flex flex-col md:flex-row bg-gray-100 dark:bg-neutral-800 w-screen flex-1 border border-neutral-200 dark:border-neutral-700 overflow-hidden",
                "h-screen"
            )}
        >
            <Sidebar open={open} setOpen={setOpen}>
                <SidebarBody className="justify-between gap-10">
                    <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
                        {open ? <Logo /> : <LogoIcon />}
                        <div className="mt-8 flex flex-col gap-2">
                            {routesSideBar.map((route, idx) => (
                                <SidebarLink
                                    className={route.path === pathName ? 'bg-slate-300' : ''}
                                    key={idx}
                                    link={{
                                        label: route.name,
                                        href: route.path,
                                        icon: route.icon
                                    }}
                                />
                            ))}
                        </div>
                    </div>
                    <div>
                        <SidebarLink
                            link={{
                                label: "Manu Arora",
                                href: "#",
                                icon: (
                                    <Image
                                        src="https://assets.aceternity.com/manu.png"
                                        className="h-7 w-7 flex-shrink-0 rounded-full"
                                        width={50}
                                        height={50}
                                        alt="Avatar"
                                    />
                                ),
                            }}
                        />
                    </div>
                </SidebarBody>
            </Sidebar>
            <div className="flex flex-col flex-1 overflow-hidden">
                <Header /> {/* Add the AdminHeader component here */}
                <DashboardAdministrationPanel>
                    {children}
                </DashboardAdministrationPanel>
            </div>
        </div> : 'loaging...'}
        </>
    );
}



