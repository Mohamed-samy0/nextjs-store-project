import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

function RatingInput({ name, labelText }: { name: string; labelText: string }) {
  const numbers = Array.from({ length: 5 }, (_, index) => {
    const value = index + 1;
    return value.toString();
  }).reverse();
  return (
    <div className="mb-2 max-w-xs">
      <Label htmlFor={name} className="capitalize">
        {labelText || name}
      </Label>
      <Select defaultValue={numbers[0]} name={name} required>
        <SelectTrigger className="w-48 h-12 text-base">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {numbers.map((num) => {
            return (
              <SelectItem key={num} value={num}>
                {num}
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>
    </div>
  );
}

export default RatingInput;
