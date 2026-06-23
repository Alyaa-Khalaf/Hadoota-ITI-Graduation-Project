"use client";

import { useChildren } from "@/hooks/useChildren";

type Child = {
  _id: string;
  name: string;
  age: number;
  gender: number;
  avatar: string;
};

type Props = {
  selectedChildId: string;
  setSelectedChildId: (id: string) => void;
};

export default function ChildrenList({
  selectedChildId,
  setSelectedChildId,
}: Props) {
  const { children, loading } = useChildren();

  if (loading) {
    return (
      <div className="p-6 text-sm text-gray-400 animate-pulse">
        Loading children...
      </div>
    );
  }

  if (!children.length) {
    return (
      <div className="p-6 text-sm text-gray-400 text-center">
        No children found.
      </div>
    );
  }

  return (
   <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">

      {children.map((child: Child) => {
        const isActive = selectedChildId === child._id;

        return (
          <div
            key={child._id}
            onClick={() => setSelectedChildId(child._id)}
            className={`
              relative cursor-pointer rounded-2xl p-5 transition-all duration-300
              border backdrop-blur-md mt-18
              ${
                isActive
                  ? "bg-orange-50 border-orange-400 shadow-md scale-[1.02]"
                  : "bg-white border-gray-100 hover:shadow-md hover:-translate-y-1"
              }
            `}
          >

            {/* Glow effect for active */}
            {isActive && (
              <div className="absolute inset-0 rounded-2xl bg-orange-100 opacity-30 blur-xl -z-10" />
            )}

            {/* Header */}
            <div className="flex items-center gap-3">

              {/* Avatar */}
              <div
                className={`
                  w-12 h-12 rounded-full flex items-center justify-center text-xl
                  ${isActive ? "bg-orange-200" : "bg-gray-100"}
                `}
              >
                {child.avatar || "👶"}
              </div>

              {/* Info */}
              <div className="flex-1">
                <h3 className="font-bold text-sm text-gray-800">
                  {child.name}
                </h3>

                <p className="text-xs text-gray-500">
                  Age {child.age} • Gender {child.gender === 1 ? "Boy" : "Girl"}
                </p>
              </div>

              {/* Status Badge */}
              {isActive && (
                <span className="text-[10px] px-2 py-1 rounded-full bg-orange-500 text-white font-bold">
                  ACTIVE
                </span>
              )}
            </div>

            {/* Bottom hint */}
            <div className="mt-4 flex justify-between items-center">

              <span className="text-[11px] text-gray-400">
                Tap to view analytics
              </span>

              <div
                className={`
                  w-2 h-2 rounded-full
                  ${isActive ? "bg-orange-500" : "bg-gray-200"}
                `}
              />
            </div>

          </div>
        );
      })}

    </div>
  );
}