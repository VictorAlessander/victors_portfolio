import { useState } from "react";
import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { IDataTableProps } from "@/common";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Asset from "@/entities/Asset";
import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDownIcon } from "lucide-react";
import Header from "@/components/ui/Header";
import RefreshPricesButton from "@/components/Assets/RefreshPricesButton";
import dayjs from "dayjs";

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
};

export const columns: ColumnDef<Asset>[] = [
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
        <div className="text-left font-bold text-lg">{row.getValue("symbol")}</div>
      );
    },
  },
  {
    accessorKey: "sector",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Sector
          <ArrowUpDownIcon className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      return (
        <div className="text-left">{row.getValue("sector") || "Unknown"}</div>
      );
    },
  },
  {
    accessorKey: "category",
    header: "Category",
    cell: ({ row }) => {
      return (
        <div className="text-left">{row.getValue("category") || "Stock"}</div>
      );
    },
  },
  {
    accessorKey: "quantity",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Quantity
          <ArrowUpDownIcon className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      return (
        <div className="text-right font-medium">
          {row.getValue("quantity")}
        </div>
      );
    },
  },
  {
    accessorKey: "cost",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Total Cost
          <ArrowUpDownIcon className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("cost"));
      return <div className="text-right font-medium">{formatCurrency(amount)}</div>;
    },
  },
  {
    accessorKey: "market_value",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Market Value
          <ArrowUpDownIcon className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("market_value"));
      return <div className="text-right font-medium">{formatCurrency(amount)}</div>;
    },
  },
  {
    id: "profitLoss",
    header: "P&L",
    cell: ({ row }) => {
      const cost = parseFloat(row.getValue("cost"));
      const marketValue = parseFloat(row.getValue("market_value"));
      const profitLoss = marketValue - cost;
      const profitLossColor = profitLoss >= 0 ? "text-green-600" : "text-red-600";

      return (
        <div className={`text-right font-medium ${profitLossColor}`}>
          {formatCurrency(profitLoss)}
        </div>
      );
    },
  },
  {
    id: "profitLossPercentage",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          P&L %
          <ArrowUpDownIcon className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    sortingFn: (rowA, rowB) => {
      const costA = parseFloat(rowA.getValue("cost"));
      const marketValueA = parseFloat(rowA.getValue("market_value"));
      const percentageA = costA > 0 ? ((marketValueA - costA) / costA) * 100 : 0;

      const costB = parseFloat(rowB.getValue("cost"));
      const marketValueB = parseFloat(rowB.getValue("market_value"));
      const percentageB = costB > 0 ? ((marketValueB - costB) / costB) * 100 : 0;

      return percentageA - percentageB;
    },
    cell: ({ row }) => {
      const cost = parseFloat(row.getValue("cost"));
      const marketValue = parseFloat(row.getValue("market_value"));
      const percentage = cost > 0 ? ((marketValue - cost) / cost) * 100 : 0;
      const profitLossColor = percentage >= 0 ? "text-green-600" : "text-red-600";

      return (
        <div className={`text-right font-medium ${profitLossColor}`}>
          {percentage >= 0 ? "+" : ""}{percentage.toFixed(2)}%
        </div>
      );
    },
  },
];

interface AssetsProps {
  data: Asset[];
}

function AssetsDataTable<TData, TValue>({
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
    // if (isError) {
    //   return (
    //     <TableBody>
    //       <TableRow>
    //         <TableCell colSpan={columns.length} className="h-24 text-center">
    //           An error occurred.
    //         </TableCell>
    //       </TableRow>
    //     </TableBody>
    //   );
    // }
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
      <TableCaption>Holdings</TableCaption>
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

function Assets(props: AssetsProps) {
  const totalInvested = props.data.reduce((sum, asset) => sum + parseFloat(asset.cost.toString()), 0);
  const totalMarketValue = props.data.reduce((sum, asset) => sum + parseFloat((asset.market_value || asset.marketCost || 0).toString()), 0);
  const totalProfitLoss = totalMarketValue - totalInvested;
  const totalProfitLossPercentage = totalInvested > 0 ? (totalProfitLoss / totalInvested) * 100 : 0;

  // Find the most recent price update
  const lastUpdate = props.data
    .filter(asset => asset.last_price_update)
    .map(asset => new Date(asset.last_price_update!))
    .sort((a, b) => b.getTime() - a.getTime())[0];

  return (
    <>
      <Header />
      <div className="container mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">Assets Portfolio</h1>
            {lastUpdate && (
              <p className="text-sm text-gray-500 mt-1">
                Last price update: {dayjs(lastUpdate).format("DD/MM/YYYY HH:mm")}
              </p>
            )}
          </div>
          <RefreshPricesButton />
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Assets</h3>
            <p className="text-2xl font-bold mt-2">{props.data.length}</p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Invested</h3>
            <p className="text-2xl font-bold mt-2">{formatCurrency(totalInvested)}</p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Market Value</h3>
            <p className="text-2xl font-bold mt-2">{formatCurrency(totalMarketValue)}</p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Total P&L</h3>
            <p className={`text-2xl font-bold mt-2 ${totalProfitLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {formatCurrency(totalProfitLoss)}
            </p>
            <p className={`text-sm mt-1 ${totalProfitLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {totalProfitLossPercentage >= 0 ? '+' : ''}{totalProfitLossPercentage.toFixed(2)}%
            </p>
          </div>
        </div>

        {/* Assets Table */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
          <AssetsDataTable
            columns={columns}
            data={props.data}
          />
        </div>
      </div>
    </>
  );
}

export default Assets;
