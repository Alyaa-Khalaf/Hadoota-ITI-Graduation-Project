// components/layout/ChildLayout.tsx

import ChildNavbar from "../ChildAdventure/ChildNavbar";

export default function ChildLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <ChildNavbar />
      <main className="pt-24">
        {children}
      </main>
    </>
  );
}