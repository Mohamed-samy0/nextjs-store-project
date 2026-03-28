"use client";
import { adminLinks } from "@/utils/links";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";

function Sidebar() {
  const pathName = usePathname();
  return (
    <aside>
      {adminLinks.map((link) => {
        const isActivePage = pathName === link.href;
        const variant = isActivePage ? "default" : "ghost";
        return (
          <Button
            asChild
            className="w-full mb-2 capitalize font-normal"
            variant={variant}
            key={link.href}
          >
            <Link key={link.href} href={link.href}>
              {link.label}
            </Link>
          </Button>
        );
      })}
    </aside>
  );
}
export default Sidebar;
