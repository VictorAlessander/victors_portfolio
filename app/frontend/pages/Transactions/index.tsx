import { useState } from "react";
import Header from "@/components/ui/Header";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDownIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import dayjs from "dayjs";
import Transaction from "@/entities/Transaction";
import { Trash2Icon } from "lucide-react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { IDataTableProps } from "@/common";
import AddTransactionButton from "@/components/Transactions/AddTransactionButton";
import EditTransactionButton from "@/components/Transactions/EditTransactionButton";
import { router } from "@inertiajs/react";

interface TransactionsProps {
  data: Transaction[];
}

const RemoveTransactionButton = ({ id }: { id: number }) => {
  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this transaction?")) {
      router.delete(`/operations/${id}`, {
        onSuccess: () => {
          router.reload({ only: ["data"] });
        },
        onError: (errors) => {
          console.error("Failed to delete transaction:", errors);
          alert("Failed to delete transaction. Please try again.");
        },
      });
    }
  };

  return (
    <div className="text-center">
      <Button size="sm" variant="outline" onClick={handleDelete}>
        <Trash2Icon className="h-4 w-4" />
      </Button>
    </div>
  );
};

export const columns: ColumnDef<Transaction>[] = [
  {
    accessorKey: "symbol",
    header: "Symbol",
    cell: ({ row }) => {
      return (
        <div className="text-center font-medium">{row.getValue("symbol")}</div>
      );
    },
  },
  {
    accessorKey: "created_at",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "desc")}
        >
          Date
          <ArrowUpDownIcon className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const date = row.getValue("created_at") as Date;
      return (
        <div className="text-center font-medium">
          {dayjs(date).format("DD-MM-YYYY")}
        </div>
      );
    },
  },
  {
    accessorKey: "quantity",
    header: "Quantity",
    cell: ({ row }) => {
      return (
        <div className="text-center font-medium">
          {row.getValue("quantity")}
        </div>
      );
    },
  },
  {
    accessorKey: "cost",
    header: "Cost",
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("cost"));
      const formatted = new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
      }).format(amount);

      return <div className="text-center font-medium">{formatted}</div>;
    },
  },
  {
    accessorKey: "op_type",
    header: "Type",
    cell: ({ row }) => {
      return (
        <div className="text-center font-medium">
          {row.getValue("op_type") == "buy" ? "B" : "S"}
        </div>
      );
    },
  },
  {
    id: "actions",
    header: "",
    cell: ({ row }) => {
      return (
        <div className="text-center flex gap-2 justify-end">
          <EditTransactionButton transaction={row.original} />
          <RemoveTransactionButton id={row.original.id} />
        </div>
      );
    },
  },
];

function TransactionsDataTable<TData, TValue>({
  columns,
  data,
}: IDataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    state: { sorting },
  });

  const tableBody = () => {
    /*if (isError) {
      return (
        <TableBody>
          <TableRow>
            <TableCell colSpan={columns.length} className="h-24 text-center">
              An error occurred.
            </TableCell>
          </TableRow>
        </TableBody>
      );
    } */
    return (
      <TableBody>
        {table.getRowModel().rows?.length ? (
          table.getRowModel().rows.map((row) => (
            <TableRow
              key={row.id}
              data-state={row.getIsSelected() && "selected"}
            >
              {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={columns.length} className="h-24 text-center">
              No results.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    );
  };

  return (
    <Table>
      <TableCaption>Transactions</TableCaption>
      <TableHeader>
        {table.getHeaderGroups().map((headerGroup) => (
          <TableRow key={headerGroup.id}>
            {headerGroup.headers.map((header) => {
              return (
                <TableHead key={header.id} className="text-center">
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                </TableHead>
              );
            })}
          </TableRow>
        ))}
      </TableHeader>
      {tableBody()}
    </Table>
  );
}

function Transactions({ data }: TransactionsProps) {
  const totalBuys = data.filter(t => t.op_type === 'buy').length;
  const totalSells = data.filter(t => t.op_type === 'sell').length;
  const totalInvested = data
    .filter(t => t.op_type === 'buy')
    .reduce((sum, t) => sum + parseFloat(t.cost.toString()), 0);

  return (
    <>
      <Header />
      <div className="container mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Transactions</h1>
          <AddTransactionButton />
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Transactions</h3>
            <p className="text-2xl font-bold mt-2">{data.length}</p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Buy / Sell</h3>
            <p className="text-2xl font-bold mt-2">
              <span className="text-green-600">{totalBuys}</span>
              {" / "}
              <span className="text-red-600">{totalSells}</span>
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Invested</h3>
            <p className="text-2xl font-bold mt-2">
              {new Intl.NumberFormat("pt-BR", {
                style: "currency",
                currency: "BRL",
              }).format(totalInvested)}
            </p>
          </div>
        </div>

        {/* Transactions Table */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
          <TransactionsDataTable columns={columns} data={data} />
        </div>
      </div>
    </>
  );
}

export default Transactions;
