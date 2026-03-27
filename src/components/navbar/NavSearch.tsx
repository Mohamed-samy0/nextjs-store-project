"use client";
import { Input } from "../ui/input";
import { useSearchParams, useRouter } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";
import { useState, useEffect } from "react";
function NavSearch() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState(
    searchParams.get("search")?.toString() || "",
  );

  const debouncedSearchTerm = useDebouncedCallback((value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set("search", value);
    } else {
      params.delete("search");
    }
    router.push(`/products?${params.toString()}`);
  }, 500);

  useEffect(() => {
    debouncedSearchTerm(searchTerm);
  }, [searchTerm, debouncedSearchTerm]);

  return (
    <Input
      type="text"
      placeholder="Search products..."
      className="max-w-xs dark:bg-muted"
      value={searchTerm}
      onChange={(e) => {
        setSearchTerm(e.target.value);
        debouncedSearchTerm(e.target.value);
      }}
    />
  );
}

export default NavSearch;
