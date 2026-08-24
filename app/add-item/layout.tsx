import type { Metadata } from "next";
import { Aside } from "../components/aside/aside";

export const metadata: Metadata = {
  title: "Add Item | Groove & Grind",
  description: "",
};

export default function Layout({ children }: LayoutProps<"/">) {
  return (
    <div className="grid grid-cols-[200px_1fr]">
      <Aside />
      {children}
    </div>
  );
}
