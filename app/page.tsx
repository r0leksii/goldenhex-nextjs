// "use client"
import "dotenv/config"
import { Card } from "@/components/ui/card"
require("dotenv").config()
import type { GetProductQueryParameters } from "@/services/types/catalogue/catalogue.types"
import type { GetProductResponse } from "@/services/types/catalogue/catalogue.types"

const NEXT_EPOS_KEY = process.env.NEXT_EPOS_KEY
const NEXT_EPOS_SECRET = process.env.NEXT_EPOS_SECRET
const credentials = `${NEXT_EPOS_KEY}:${NEXT_EPOS_SECRET}`
const base64Credentials = btoa(credentials)

const queryParams: GetProductQueryParameters = {
  Page: 1,
  Limit: 50,
  Search: "wine",
  // Add other default query params here if needed
}

if (queryParams.Search !== undefined) {
  queryParams.Page = undefined
  queryParams.Limit = undefined
}

async function getCatalogueProducts(
  queryParams: GetProductQueryParameters,
): Promise<GetProductResponse> {
  const url = new URL(`${process.env.NEXT_EPOS_URL}/catalogue/products`)

  // Dynamically add query parameters to the URL using for...of loop
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

export default async function Home() {
  const catalogueProducts = await getCatalogueProducts(queryParams)
  // await new Promise((resolve) => setTimeout(resolve, 2000))

  return (
    <main className="flex flex-col gap-3 p-4">
      <p>Total Pages: {catalogueProducts?.Metadata?.TotalPages}</p>
      <p>Total Records: {catalogueProducts?.Metadata?.TotalRecords}</p>
      <p>Current Page Size: {catalogueProducts?.Metadata?.CurrentPageSize}</p>

      <p>Base URL: {catalogueProducts?.Links?.BaseURL}</p>
      <p>First Page: {catalogueProducts?.Links?.FirstPage}</p>
      <p>Last Page: {catalogueProducts?.Links?.LastPage}</p>
      <p>Next Page: {catalogueProducts?.Links?.NextPage}</p>
      <p>Previous Page: {catalogueProducts?.Links?.PreviousPage}</p>

      <div className="flex flex-row flex-wrap gap-3">
        {catalogueProducts?.Data?.map((product) => (
          <Card className={"w-64 p-4"} key={product.Id}>
            {/*{product.ProductImages.map((img) => (*/}
            {/*  <img key={img.ProductImageId} alt={""} src={img.ImageUrl} />*/}
            {/*))}*/}
            <h2>{product.Name}</h2>
            {/*<p>{product.Description}</p>*/}
            <p>SalePriceIncTax ${product.SalePriceIncTax}</p>
            <p>ID: {product.Id}</p>
            <p>Barcode: {product?.Barcode?.split(",").join(", ")}</p>
            {!product.SellOnWeb && <p>SellOnWeb: false</p>}
          </Card>
        ))}
      </div>
    </main>
  )
}
