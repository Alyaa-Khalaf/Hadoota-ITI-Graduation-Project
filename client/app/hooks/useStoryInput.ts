"use client";

import { useChild } from "@/hooks/useChild";

export const useStoryInput = () => {
  const { child } = useChild();

  const params =
    typeof window !== "undefined"
      ? new URLSearchParams(window.location.search)
      : null;

  return {
    childId: child?._id,
    childName: child?.name,
    childAge: child?.age,
    character: params?.get("character") || "",
    topic: params?.get("topic") || "",
  };
};