import React from "react";

type AdventureHeaderProps = {
  header: string;
  subHeader?: string;
};

export default function AdventureHeader({
  header,
  subHeader,
}: AdventureHeaderProps) {
  return (
    <div className="flex justify-center py-8 mt-8">
      <div
        className="inline-flex flex-col items-center text-center font-bold  px-8 py-5 border-r-4 border-b-4 border-sunny rounded-br-3xl"
      >
        <h2 className=" text-3xl text-header">
          {header}
        </h2>

        <p className="mt-2 text-sm  text-ink-mute">
          {subHeader}
        </p>
      </div>
    </div>
  );
}