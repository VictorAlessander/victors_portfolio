import { ColumnDef } from "@tanstack/react-table";

export interface IDataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  isSuccess?: boolean;
  isError?: boolean;
}
