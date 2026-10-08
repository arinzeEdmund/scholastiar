"use client";

import { Bot, Ellipsis, Handshake } from "lucide-react";
import Link from "next/link";
import { useOptimistic, useTransition } from "react";
import toast from "react-hot-toast";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { BoardKey, SavedOpportunityType } from "@/data/types";
import { setOpportunityOnBoard } from "@/lib/actions/opportunities";

const BOARDS: { key: BoardKey; label: string; added: string; removed: string; Icon: typeof Bot }[] = [
  {
    key: "ai_apply_agent",
    label: "AI Apply Agent board",
    added: "Added to your AI Apply Agent board",
    removed: "Removed from your AI Apply Agent board",
    Icon: Bot,
  },
  {
    key: "apply_for_me",
    label: "Apply For Me board",
    added: "Added to your Apply For Me board",
    removed: "Removed from your Apply For Me board",
    Icon: Handshake,
  },
];

/** "More" menu on a card: add to the AI Apply Agent or Apply For Me board. */
export function BoardMenu({
  type,
  id,
  name,
  boards,
  signUpHref,
}: {
  type: SavedOpportunityType;
  id: string;
  name: string;
  boards: BoardKey[];
  /** Present for visitors: the menu offers sign-up instead. */
  signUpHref?: string;
}) {
  const [optimistic, setOptimistic] = useOptimistic(boards);
  const [pending, startTransition] = useTransition();

  function toggle(board: (typeof BOARDS)[number]) {
    const on = !optimistic.includes(board.key);
    startTransition(async () => {
      setOptimistic(on ? [...optimistic, board.key] : optimistic.filter((b) => b !== board.key));
      const result = await setOpportunityOnBoard({ board: board.key, type, id, on });
      if (!result.ok) toast.error(result.error);
      else toast.success(on ? board.added : board.removed);
    });
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="size-9 rounded-lg"
          aria-label={`More actions for ${name}`}
          disabled={pending}
        >
          <Ellipsis aria-hidden />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        <DropdownMenuLabel>Let us help you apply</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {signUpHref
          ? BOARDS.map(({ key, label, Icon }) => (
              <DropdownMenuItem key={key} asChild>
                <Link href={signUpHref}>
                  <Icon aria-hidden />
                  Sign up to use the {label}
                </Link>
              </DropdownMenuItem>
            ))
          : BOARDS.map((board) => (
              <DropdownMenuCheckboxItem
                key={board.key}
                checked={optimistic.includes(board.key)}
                onCheckedChange={() => toggle(board)}
                onSelect={(event) => event.preventDefault()}
              >
                <board.Icon aria-hidden />
                {board.label}
              </DropdownMenuCheckboxItem>
            ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
