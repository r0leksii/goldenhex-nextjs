import "dotenv/config";
import { Card } from "@/components/ui/card";
require("dotenv").config();

// Define the TypeScript types
type MeasurementDetails = {
  salePriceMeasurementSchemeItemId: number;
  salePriceMeasurementUnitVolume: number;
  salePriceFactor: number;
  salePriceUnit: string;
  costPriceMeasurementSchemeItemId: number;
  costPriceMeasurementUnitVolume: number;
  costPriceFactor: number;
  costPriceUnit: string;
};

type Supplier = {
  id: number;
  name: string;
  description: string;
  addressLine1: string;
  addressLine2: string;
  town: string;
  county: string;
  postCode: string;
  contactNumber: string;
  contactNumber2: string;
  emailAddress: string;
  type: string;
  referenceCode: string;
};

type TaxRate = {
  taxGroupId: number;
  taxRateId: number;
  locationId: number;
  priority: number;
  percentage: number;
  name: string;
  description: string;
  taxCode: string;
};

type TaxGroup = {
  id: number;
  name: string;
  taxRates: TaxRate[];
};

type ProductTag = {
  id: number;
  name: string;
};

type ProductUdf = {
  id: number;
  name: string;
  value: string;
};

type ProductLocationAreaPrice = {
  locationAreaId: number;
  salePrice: number;
  costPriceExcTax: number;
  eatOutPrice: number;
};

type ProductImage = {
  productId: number;
  productImageId: number;
  imageUrl: string;
  mainImage: boolean;
};

type CustomerProductPricingDetail = {
  priceId: number;
  typeId: number;
  typeName: string;
  price: number;
  eatOutPrice: number;
  productId: number;
};

type ProductDetail = {
  productId: number;
  detailedDescription: string;
};

type Product = {
  Id: number;
  Name: string;
  Description: string;
  costPrice: number;
  isCostPriceIncTax: boolean;
  SalePrice: number;
  isSalePriceIncTax: boolean;
  eatOutPrice: number;
  isEatOutPriceIncTax: boolean;
  categoryId: number;
  barcode: string;
  salePriceTaxGroupId: number;
  eatOutPriceTaxGroupId: number;
  costPriceTaxGroupId: number;
  brandId: number;
  supplierId: number;
  popupNoteId: number;
  unitOfSale: number;
  volumeOfSale: number;
  variantGroupId: number;
  multipleChoiceNoteId: number;
  size: string;
  sku: string;
  sellOnWeb: boolean;
  sellOnTill: boolean;
  orderCode: string;
  sortPosition: number;
  rrPrice: number;
  productType: number;
  tareWeight: number;
  articleCode: string;
  isTaxExemptable: boolean;
  referenceCode: string;
  isVariablePrice: boolean;
  excludeFromLoyaltyPointsGain: boolean;
  IsArchived: boolean;
  colourId: number;
  measurementDetails: MeasurementDetails;
  supplier: Supplier;
  salePriceTaxGroup: TaxGroup;
  eatOutPriceTaxGroup: TaxGroup;
  costPriceTaxGroup: TaxGroup;
  productTags: ProductTag[];
  productUdfs: ProductUdf[];
  additionalSuppliersIds: number[];
  productLocationAreaPrices: ProductLocationAreaPrice[];
  productImages: ProductImage[];
  isMultipleChoiceProductOptional: boolean;
  customerProductPricingDetails: CustomerProductPricingDetail[];
  containerFeeId: number;
  buttonColourId: number;
  productDetails: ProductDetail;
};

const NEXT_EPOS_KEY = process.env.NEXT_EPOS_KEY;
const NEXT_EPOS_SECRET = process.env.NEXT_EPOS_SECRET;
const credentials = `${NEXT_EPOS_KEY}:${NEXT_EPOS_SECRET}`;
const base64Credentials = btoa(credentials);

async function getCategories(): Promise<Product[]> {
  const res = await fetch("https://api.eposnowhq.com/api/v4/category/", {
    cache: "force-cache",
    headers: {
      Authorization: `Basic ${base64Credentials}`,
    },
  });

  return await res.json();
}

async function getProducts(): Promise<Product[]> {
  const res = await fetch("https://api.eposnowhq.com/api/v4/product/", {
    cache: "force-cache",
    headers: {
      Authorization: `Basic ${base64Credentials}`,
    },
  });

  return await res.json();
}

export default async function Home() {
  const categories = await getCategories();
  const products = await getProducts();
  const filteredProducts = products
    .filter((product) => !product.IsArchived)
    .slice(0, 100);

  return (
    <main className="flex flex-col gap-3 p-4">
      <div className="grid grid-cols-6 gap-3">
        {categories.map((category) => (
          <div key={category.Id}>{category.Name}</div>
        ))}
      </div>
      <div className="grid grid-cols-6 gap-3">
        {filteredProducts.map((product) => (
          <Card className={"p-4"} key={product.Id}>
            <h2>{product.Name}</h2>
            <p>{product.Description}</p>
            <p>Sale Price: ${product.SalePrice}</p>
            <p>ID: {product.Id}</p>
          </Card>
        ))}
      </div>
    </main>
  );
}
