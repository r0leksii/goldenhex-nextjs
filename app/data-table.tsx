"use client"

import {
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table"

import { SearchInput } from "@/components/search-input"
import {
  Button,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import React from "react"

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  pageSize: number
  currentPage: number
  searchQuery: string
  totalPages?: number
}

export function DataTable<TData, TValue>({
  columns,
  data,
  pageSize,
  currentPage,
  totalPages,
  searchQuery,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  )

  const router = useRouter()
  const searchParams = useSearchParams()

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    // getPaginationRowModel: getPaginationRowModel(),
    // getFilteredRowModel: getFilteredRowModel(),
    // onColumnFiltersChange: setColumnFilters,
    state: {
      // sorting,
      // columnFilters,
      pagination: {
        pageIndex: currentPage - 1,
        pageSize,
      },
    },
    manualPagination: true,
  })

  const handlePageSizeLimitChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set("limit", value)
    router.push(`?${params.toString()}`)
  }

  const handlePreviousPage = () => {
    const params = new URLSearchParams(searchParams.toString())
    const currentPageFromURL = Number.parseInt(params.get("page") || "1", 10)
    if (currentPageFromURL > 1) {
      params.set("page", (currentPageFromURL - 1).toString())
      router.push(`?${params.toString()}`)
    }
  }

  const handleNextPage = () => {
    const params = new URLSearchParams(searchParams.toString())
    const currentPageFromURL = Number.parseInt(params.get("page") || "1", 10)
    if (currentPageFromURL < (totalPages || Number.POSITIVE_INFINITY)) {
      params.set("page", (currentPageFromURL + 1).toString())
      router.push(`?${params.toString()}`)
    }
  }

  return (
    <div className="rounded-md border">
      <SearchInput initialSearchValue={searchQuery} />

      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                )
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
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <div className={"flex items-center justify-end g-4 pt-4"}>
        <div className="flex items-center space-x-2">
          <p className="text-sm font-medium">Rows per page</p>
          <Select
            value={pageSize.toString()}
            onValueChange={handlePageSizeLimitChange}
          >
            <SelectTrigger className="h-8 w-[70px]">
              <SelectValue placeholder={pageSize} />
            </SelectTrigger>
            <SelectContent side="top">
              <SelectItem value={"10"}>10</SelectItem>
              <SelectItem value={"20"}>20</SelectItem>
              <SelectItem value={"50"}>50</SelectItem>
              <SelectItem value={"100"}>100</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex w-[100px] items-center justify-center text-sm font-medium">
          Page {table.getState().pagination.pageIndex + 1} of {totalPages}
        </div>
        <Button
          disabled={currentPage <= 1}
          onClick={handlePreviousPage}
          variant={"outline"}
        >
          <ChevronLeftIcon className={"w-4 h-4"} />
          Go to previous page
        </Button>
        <Button
          disabled={currentPage >= (totalPages || Number.POSITIVE_INFINITY)}
          onClick={handleNextPage}
          variant={"outline"}
        >
          Go to the next page
          <ChevronRightIcon className={"w-4 h-4"} />
        </Button>
      </div>
    </div>
  )
}
