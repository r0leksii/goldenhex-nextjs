import type { components, paths } from "@/services/schema"

// Types for the GET request
export type GetProductQueryParameters =
  paths["/api/v4/Catalogue/products"]["get"]["parameters"]["query"]
export type GetProductResponse =
  components["schemas"]["IProductGridPagedResponse"]

// Types for the POST request
export type CreateProductRequest = components["schemas"]["ProductGridRequest"]
export type CreateProductResponse = components["schemas"]["IProductGrid"]
