import { VscCode } from "react-icons/vsc";
import { Button } from "../ui/button";
import Link from "next/link";

function Logo() {
  return (
    <Button size="icon-lg" asChild>
      <Link href="/" aria-label="Home Page">
        <VscCode className="w-6 h-6" />
      </Link>
    </Button>
  );
}

export default Logo;
