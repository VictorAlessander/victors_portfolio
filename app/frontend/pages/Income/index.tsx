import { useState } from "react";
import Header from "@/components/ui/Header";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDownIcon, Trash2Icon, PencilIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import dayjs from "dayjs";
import Income, { IncomeSummary } from "@/entities/Income";
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
import { router } from "@inertiajs/react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend } from "recharts";
import AddIncomeButton from "@/components/Income/AddIncomeButton";

interface IncomePageProps {
  data: Income[];
  summary: IncomeSummary;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
};

const incomeTypeLabels: Record<string, string> = {
  dividend: "Dividend",
  jcp: "JCP",
  bonus: "Bonus",
  subscription_rights: "Subscription Rights",
};

const RemoveIncomeButton = ({ id }: { id: number }) => {
  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this income record?")) {
      router.delete(`/incomes/${id}`, {
        onSuccess: () => {
          router.reload({ only: ["data", "summary"] });
        },
        onError: (errors) => {
          console.error("Failed to delete income:", errors);
          alert("Failed to delete income. Please try again.");
        },
      });
    }
  };

  return (
    <Button size="sm" variant="outline" onClick={handleDelete}>
      <Trash2Icon className="h-4 w-4" />
    </Button>
  );
};

export const columns: ColumnDef<Income>[] = [
  {
    accessorKey: "payment_date",
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
      const date = row.getValue("payment_date") as string;
      return (
        <div className="text-left font-medium">
          {dayjs(date).format("DD-MM-YYYY")}
        </div>
      );
    },
  },
  {
    accessorKey: "symbol",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Symbol
          <ArrowUpDownIcon className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      return (
        <div className="text-left font-bold">{row.getValue("symbol")}</div>
      );
    },
  },
  {
    accessorKey: "income_type",
    header: "Type",
    cell: ({ row }) => {
      const type = row.getValue("income_type") as string;
      const typeColors: Record<string, string> = {
        dividend: "bg-green-100 text-green-800",
        jcp: "bg-blue-100 text-blue-800",
        bonus: "bg-purple-100 text-purple-800",
        subscription_rights: "bg-orange-100 text-orange-800",
      };

      return (
        <div className="text-left">
          <span className={`px-2 py-1 rounded text-xs ${typeColors[type] || "bg-gray-100 text-gray-800"}`}>
            {incomeTypeLabels[type] || type}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "quantity",
    header: "Quantity",
    cell: ({ row }) => {
      const quantity = row.getValue("quantity") as number | undefined;
      return (
        <div className="text-right">
          {quantity || "-"}
        </div>
      );
    },
  },
  {
    accessorKey: "amount",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Amount
          <ArrowUpDownIcon className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("amount"));
      return <div className="text-right font-medium text-green-600">{formatCurrency(amount)}</div>;
    },
  },
  {
    accessorKey: "tax_withheld",
    header: "Tax Withheld",
    cell: ({ row }) => {
      const tax = row.getValue("tax_withheld") as number | undefined;
      return (
        <div className="text-right text-red-600">
          {tax ? formatCurrency(tax) : "-"}
        </div>
      );
    },
  },
  {
    id: "actions",
    header: "",
    accessorKey: "id",
    cell: ({ row }) => {
      return (
        <div className="text-center flex gap-2 justify-end">
          <RemoveIncomeButton id={row.getValue("id")} />
        </div>
      );
    },
  },
];

function IncomeDataTable<TData, TValue>({
  columns,
  data,
}: IDataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([{ id: "payment_date", desc: true }]);
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    state: { sorting },
  });

  return (
    <Table>
      <TableCaption>Income History</TableCaption>
      <TableHeader>
        {table.getHeaderGroups().map((headerGroup) => (
          <TableRow key={headerGroup.id}>
            {headerGroup.headers.map((header) => {
              return (
                <TableHead key={header.id} className="text-left">
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
              No income records yet.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}

export default function IncomePage({ data, summary }: IncomePageProps) {
  return (
    <>
      <Header />
      <div className="container mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Income & Dividends</h1>
          <AddIncomeButton />
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Income</h3>
            <p className="text-2xl font-bold mt-2 text-green-600">{formatCurrency(summary.total_income)}</p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">This Year</h3>
            <p className="text-2xl font-bold mt-2">{formatCurrency(summary.income_this_year)}</p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">This Month</h3>
            <p className="text-2xl font-bold mt-2">{formatCurrency(summary.income_this_month)}</p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Avg Monthly</h3>
            <p className="text-2xl font-bold mt-2">{formatCurrency(summary.average_monthly_income)}</p>
          </div>
        </div>

        {/* Charts Section */}
        {summary.income_by_symbol.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Income by Symbol Pie Chart */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Income by Asset</h2>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={summary.income_by_symbol}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={(entry) => `${entry.symbol} (${entry.percentage}%)`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="total"
                  >
                    {summary.income_by_symbol.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: number) => formatCurrency(value)} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Income by Type */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Income by Type</h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={summary.income_by_type}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value: number) => formatCurrency(value)} />
                  <Bar dataKey="value" fill="#00C49F" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Income Over Time */}
        {summary.income_over_time.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">Income Over Time</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={summary.income_over_time}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value: number) => formatCurrency(value)} />
                <Legend />
                <Bar dataKey="amount" fill="#0088FE" name="Income" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Income Table */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
          <IncomeDataTable columns={columns} data={data} />
        </div>
      </div>
    </>
  );
}
