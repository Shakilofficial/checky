import { TableCell, TableRow } from "@/components/ui/table";
import { Ban } from "lucide-react";
import { ReactNode } from "react";

interface Props {
  colSpan: number;
  message: ReactNode;
}

export const DataTableEmpty = ({ colSpan, message }: Props) => {
  return (
    <TableRow>
      <TableCell colSpan={colSpan} className="h-32 text-center">
        {typeof message === "string" ? (
          <div className="flex flex-col items-center gap-3 text-muted-foreground">
            <Ban className="h-8 w-8 opacity-60" />
            <p className="font-medium">{message}</p>
          </div>
        ) : (
          message
        )}
      </TableCell>
    </TableRow>
  );
};
