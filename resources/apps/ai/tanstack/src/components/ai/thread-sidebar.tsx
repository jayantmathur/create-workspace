import { useSelector } from "@tanstack/react-store";
import type { ComponentProps } from "react";
import { GalleryVerticalEnd, Plus, Trash2, MoreHorizontal } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
  useSidebar,
} from "#/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "#/components/ui/dropdown-menu";
import { Button } from "#/components/ui/button";
import { store, actions } from "#/components/ai/stream-provider";

type ThreadSidebarProps = ComponentProps<typeof Sidebar> & {};

export function ThreadSidebar({ className, ...props }: ThreadSidebarProps) {
  const [current, threads] = useSelector(store, ({ current, threads }) => [
    current,
    threads,
  ]);
  const { createThread, deleteThread, selectThread, refresh } = actions;
  const { isMobile } = useSidebar();

  return (
    <Sidebar
      // className="*:data-[slot=sidebar-inner]:bg-transparent!"
      {...props}
    >
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem className="flex flex-row gap-2 p-2 items-center text-primary">
            <GalleryVerticalEnd className="size-4" />
            <span className="font-medium">Conversation History</span>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Recent conversations</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {threads.map(({ id, createdAt, title }) => (
                <DropdownMenu key={id}>
                  <SidebarMenuItem className="group/thread flex items-center">
                    <SidebarMenuButton
                      isActive={id === current?.id}
                      className="-mr-8 pr-8"
                      onPointerDown={() => selectThread(id)}
                    >
                      <span className="truncate">{title}</span>
                    </SidebarMenuButton>
                    <DropdownMenuTrigger asChild>
                      <Button
                        className="opacity-0 group-hover/thread:opacity-100"
                        variant={null}
                        size="icon-sm"
                        aria-label={`Options for ${title}`}
                      >
                        <MoreHorizontal />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      side={isMobile ? "bottom" : "right"}
                      align={isMobile ? "end" : "start"}
                      className="min-w-48"
                    >
                      <DropdownMenuItem aria-label="Created at" disabled>
                        {createdAt}
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        aria-label="Delete conversation"
                        variant="destructive"
                        onPointerDown={() => {
                          deleteThread(id);
                          refresh();
                        }}
                      >
                        <Trash2 /> Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </SidebarMenuItem>
                </DropdownMenu>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenuButton asChild>
          <Button
            onPointerDown={() => {
              createThread();
              refresh();
            }}
          >
            <Plus />
            New chat
          </Button>
        </SidebarMenuButton>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}

export function ThreadsProvider({
  children,
  ...props
}: ComponentProps<typeof SidebarProvider>) {
  return (
    <SidebarProvider {...props}>
      <ThreadSidebar />
      <SidebarInset className="bg-transparent! flex flex-col h-dvh min-h-0">
        <header className="flex sticky top-0 shrink-0 items-center gap-2 p-4">
          <SidebarTrigger className="-ml-1" />
        </header>
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}
