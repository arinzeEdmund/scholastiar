"use client";

import { ArrowRight, LogOut } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import toast from "react-hot-toast";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { NavItem } from "@/config/navigation";
import { isRouteReady } from "@/config/routes";
import { signOut } from "@/lib/actions/auth";
import { initials } from "@/lib/initials";

export interface ShellUser {
  name: string;
  email: string;
  subtitle?: string | null;
}

export function UserAvatar({ name, className }: { name: string; className?: string }) {
  return (
    <Avatar className={className}>
      <AvatarFallback className="bg-soft-green text-xs font-semibold text-green-dark">{initials(name)}</AvatarFallback>
    </Avatar>
  );
}

export function UserMenu({
  user,
  items = [],
  next,
}: {
  user: ShellUser;
  items?: NavItem[];
  /** Highlighted next step, e.g. "Finish payment" on the public site. */
  next?: { href: string; label: string };
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function handleSignOut() {
    startTransition(async () => {
      const result = await signOut();
      if (!result.ok) {
        toast.error(result.error);
        return;
      }
      toast.success("Signed out");
      router.push(result.data.redirectTo);
      router.refresh();
    });
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="rounded-full outline-offset-2" aria-label={`Account menu for ${user.name}`}>
        <UserAvatar name={user.name} className="size-9" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-60">
        <DropdownMenuLabel className="font-normal">
          <div className="truncate text-sm font-semibold text-primary-text">{user.name}</div>
          <div className="truncate text-xs text-secondary-text">{user.subtitle ?? user.email}</div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {next && (
          <DropdownMenuItem asChild>
            <Link href={next.href} className="font-medium text-green-dark">
              <ArrowRight aria-hidden />
              {next.label}
            </Link>
          </DropdownMenuItem>
        )}
        {items.map((item) => {
          const Icon = item.icon;
          const ready = isRouteReady(item.href);
          return ready ? (
            <DropdownMenuItem key={item.href} asChild>
              <Link href={item.href}>
                {Icon && <Icon aria-hidden />}
                {item.label}
              </Link>
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem key={item.href} disabled>
              {Icon && <Icon aria-hidden />}
              {item.label}
              <span className="ml-auto text-[0.625rem] font-semibold text-secondary-text uppercase">Soon</span>
            </DropdownMenuItem>
          );
        })}
        <DropdownMenuSeparator />
        <DropdownMenuItem disabled={pending} onSelect={handleSignOut}>
          <LogOut aria-hidden />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
