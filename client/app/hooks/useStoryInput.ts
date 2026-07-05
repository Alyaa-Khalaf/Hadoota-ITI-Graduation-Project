"use client";

import { useSearchParams } from "next/navigation";
import { useSelectedChild } from "@/context/childContext";

export const useStoryInput = () => {
  const { selectedChild } = useSelectedChild();
  const searchParams = useSearchParams();

  return {
    childId: selectedChild?._id,
    childName: selectedChild?.name,
    childAge: selectedChild?.age,
    character: searchParams.get("character") || "",
    topic: searchParams.get("topic") || "",
  };
};