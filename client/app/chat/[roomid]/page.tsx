import { AppSidebar } from '@/components/app-sidebar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Sidebar, SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import React from 'react'

function page() {
    return (
    <SidebarProvider>
        <div className="flex h-screen">
            <AppSidebar  />

            <div className="flex flex-col flex-1">
                <SidebarInset>
                    <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
                        <SidebarTrigger className="-ml-1" />
                       
                    </header>
                </SidebarInset>

               
            </div>
            </div>
      
    </SidebarProvider>
    )}

export default page