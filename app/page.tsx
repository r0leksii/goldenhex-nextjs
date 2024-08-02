import "dotenv/config"
import { columns } from "@/app/columns"
import { DataTable } from "@/app/data-table"
import { SearchBar } from "@/components/search/searchBar"
import type { GetProductQueryParameters } from "@/services/types/catalogue/catalogue.types"
import type { GetProductResponse } from "@/services/types/catalogue/catalogue.types"
import { revalidatePath } from "next/cache"
import { useSearchParams } from "next/navigation"

const NEXT_EPOS_KEY = process.env.NEXT_EPOS_KEY
const NEXT_EPOS_SECRET = process.env.NEXT_EPOS_SECRET
const NEXT_EPOS_URL = process.env.NEXT_EPOS_URL
const credentials = `${NEXT_EPOS_KEY}:${NEXT_EPOS_SECRET}`
const base64Credentials = btoa(credentials)

const getCatalogueProducts = async (
  queryParams: GetProductQueryParameters,
): Promise<GetProductResponse> => {
  const url = new URL(`${NEXT_EPOS_URL}/catalogue/products`)

  if (queryParams) {
    for (const key of Object.keys(queryParams) as Array<
      keyof GetProductQueryParameters
    >) {
      const value = queryParams[key]
      if (value !== null && value !== undefined) {
        url.searchParams.append(key, String(value))
      }
    }
  }

  const res = await fetch(url.toString(), {
    cache: "no-store",
    headers: {
      Authorization: `Basic ${base64Credentials}`,
    },
  })

  return await res.json()
}

export default async function Home({
  searchParams,
}: {
  searchParams: { limit?: number; page?: number; search?: string }
}) {
  const limit = searchParams.limit ?? 20
  const page = searchParams.page ?? 1
  const search = searchParams.search || ""

  console.log(limit)

  const queryParams: GetProductQueryParameters = {
    Limit: limit,
    Page: page,
    Search: search,
  }

  const catalogueProducts = await getCatalogueProducts(queryParams)

  if (!catalogueProducts) {
    return <div>No products found</div>
  }

  const dataTable = catalogueProducts?.Data?.map((product) => {
    return {
      Id: product.Id ? String(product.Id) : "",
      Name: product.Name,
      SalePrice: product.SalePriceIncTax,
      Barcode: product?.Barcode?.split(",").join(", "),
      SellOnWeb: product.SellOnWeb,
    }
  })

  if (!dataTable) {
    return <div>No data found</div>
  }

  return (
    <main className="flex flex-col gap-3 p-4">
      <DataTable
        columns={columns}
        data={dataTable}
        pageSize={limit}
        currentPage={page}
        totalPages={catalogueProducts?.Metadata?.TotalPages}
      />
      <p>Total Pages: {catalogueProducts?.Metadata?.TotalPages}</p>
      <p>Total Records: {catalogueProducts?.Metadata?.TotalRecords}</p>
      <p>Current Page Size: {catalogueProducts?.Metadata?.CurrentPageSize}</p>
    </main>
  )
}
