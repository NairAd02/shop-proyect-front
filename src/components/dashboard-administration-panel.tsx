"use client"
import React, { ReactNode } from 'react'

export const DashboardAdministrationPanel = (props: {
    children: ReactNode
}) => {
    return (
        <div className="flex flex-1">
            <div className="p-2 md:p-10 border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 flex flex-col gap-2 flex-1 w-full h-full overflow-x-auto">
                {props.children}
            </div>
        </div>
    );
};
