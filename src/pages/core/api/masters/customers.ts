import type { APIRoute } from "astro";
import { coreCustomers } from "@/data/product-master-data";
import { productError, productJson, safeLimit, textValue, withTenant } from "@/lib/server/productMasterApi";

export const prerender = false;

export const GET: APIRoute = async ({ request }) => {
  try {
    const tenant = await withTenant(request);
    const url = new URL(request.url);
    const query = textValue(url.searchParams.get("q"), "q", { maxLength: 120 }).toLowerCase();
    const limit = safeLimit(url.searchParams.get("limit"), 20, 50);

    const customers = coreCustomers
      .filter((customer) => customer.tenantId === tenant.tenantId && customer.status === "active")
      .filter((customer) => {
        if (!query) return true;
        return [customer.customerName, customer.billingName, customer.customerCode, customer.contactName]
          .join(" ")
          .toLowerCase()
          .includes(query);
      })
      .slice(0, limit)
      .map((customer) => ({
        id: customer.id,
        customerCode: customer.customerCode,
        customerName: customer.customerName,
        billingName: customer.billingName,
        contactName: customer.contactName,
        email: customer.email,
        phoneNumber: customer.phoneNumber,
      }));

    return productJson({ success: true, customers });
  } catch (error) {
    return productError(error);
  }
};
