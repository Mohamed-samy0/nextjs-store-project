import Loading from "@/app/favorites/loading";
import Container from "../global/Container";
import CartButton from "./CartButton";
import DarkMode from "./DarkMode";
import LinksDropdown from "./LinksDropdown";
import Logo from "./Logo";
import NavSearch from "./NavSearch";
import { Suspense } from "react";

function Navbar() {
  return (
    <nav className="border-b">
      <Container className="flex flex-col sm:flex-row sm:justify-between sm:items-center flex-wrap gap-4 py-8">
        <Logo />
        <Suspense
          fallback={
            <div className="w-full md:w-1/3 bg-muted h-12 animate-pulse rounded" />
          }
        >
          <NavSearch />
        </Suspense>
        <div className="flex gap-4 items-center ">
          <DarkMode />
          <Suspense fallback={<Loading />}>
            <CartButton />
          </Suspense>
          <Suspense fallback={<Loading />}>
            <LinksDropdown />
          </Suspense>
        </div>
      </Container>
    </nav>
  );
}

export default Navbar;
