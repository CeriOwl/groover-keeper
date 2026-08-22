import type { Metadata } from "next";
import { Aside } from "../components/aside/aside";

export const metadata: Metadata = {
  title: "Add Item | Groove & Grind",
  description: "",
};

export default function Layout({ children }: LayoutProps<"/">) {
  return (
    <div className="flex flex-row">
      <Aside />
      {children}
    </div>
  );
}
