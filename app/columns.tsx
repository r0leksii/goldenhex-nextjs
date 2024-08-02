"use client"

import type { ColumnDef } from "@tanstack/react-table"
import { MoreHorizontal, TrashIcon } from "lucide-react"

import { Button } from "@/components/ui/button"

type ProductColumn = {
  Id: string
  Name: string | null | undefined
  SalePrice: number | undefined
  Barcode: string | undefined
  SellOnWeb: boolean | undefined
}

export const columns: ColumnDef<ProductColumn>[] = [
  // { accessorKey: "Id", header: "ID" },
  { accessorKey: "Name", header: "Name" },
  {
    accessorKey: "SalePrice",
    header: "Sale Price",
    cell: ({ row }) => {
      const price = Number.parseFloat(row.getValue("SalePrice"))
      const formattedPrice = new Intl.NumberFormat("en-US", {
        currency: "USD",
        style: "currency",
      }).format(price)
      return <div>{formattedPrice}</div>
    },
  },
  { accessorKey: "Barcode", header: "Barcode" },
  { accessorKey: "SellOnWeb", header: "Sell On Web" },
  {
    accessorKey: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const editProduct = row.original
      return (
        <div className={"flex flex-row items-center gap-2"}>
          <Button variant={"outline"}>Edit</Button>
          {/*<TrashIcon />*/}
        </div>
      )
    },
  },
]
