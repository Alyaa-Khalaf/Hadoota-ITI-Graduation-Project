"use client";

import { useSelectedChild } from "@/context/childContext";

export const useStoryInput = () => {
  const {  selectedChild} = useSelectedChild();

  const params =
    typeof window !== "undefined"
      ? new URLSearchParams(window.location.search)
      : null;

  return {
    childId: selectedChild?._id,
    childName: selectedChild?.name,
    childAge: selectedChild?.age,
    character: params?.get("character") || "",
    topic: params?.get("topic") || "",
  };
};