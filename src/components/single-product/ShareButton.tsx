"use client";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "../ui/button";
import { LuShare2 } from "react-icons/lu";

import {
  XShareButton,
  EmailShareButton,
  LinkedinShareButton,
  EmailIcon,
  LinkedinIcon,
  XIcon,
} from "react-share";

function ShareButton({ productId, name }: { productId: string; name: string }) {
  const Url = process.env.NEXT_PUBLIC_WEBSITE_URL;
  const shareLink = `${Url}/products/${productId}`;
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="icon">
          <LuShare2 />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        side="top"
        align="end"
        sideOffset={10}
        className="flex items-center gap-x-2 justify-center w-full"
      >
        <div className="flex gap-2">
          <XShareButton url={shareLink} title={name}>
            <XIcon size={32} round />
          </XShareButton>
          <EmailShareButton url={shareLink} subject={name}>
            <EmailIcon size={32} round />
          </EmailShareButton>
          <LinkedinShareButton url={shareLink} title={name}>
            <LinkedinIcon size={32} round />
          </LinkedinShareButton>
        </div>
      </PopoverContent>
    </Popover>
  );
}
export default ShareButton;
