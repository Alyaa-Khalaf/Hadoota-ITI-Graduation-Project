"use client";

import { useSelectedChild } from "@/context/childContext";
import { useScreenTimeSession } from "@/hooks/useScreenTimeSession";

export default function GamesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { selectedChild } = useSelectedChild();

  useScreenTimeSession(selectedChild?._id);

  return <>{children}</>;
}