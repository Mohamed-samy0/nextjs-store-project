import { Separator } from "@/components/ui/separator";

function SectionTitle({ title }: { title: string }) {
  return (
    <div className="w-full">
      <h2 className="text-3xl font-medium tracking-wider capitalize mb-8">{title}</h2>
      <Separator className="bg-gray-200 h-px" />
    </div>
  );
}
export default SectionTitle;
