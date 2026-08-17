import "server-only";
import prisma from "@/lib/prisma";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function updateCustomerProfile(customerProfileId: string, data: any) {
  return await prisma.customerProfile.update({
    where: { id: customerProfileId },
    data: { 
      address: data.address,
      city: data.city,
      state: data.state,
      postalCode: data.postalCode,
      country: data.country
    },
  });
}

export async function getCustomerJobs(customerId: string) {
  return await prisma.job.findMany({
    where: { customerId },
    orderBy: { createdAt: "desc" },
    include: {
      worker: { select: { name: true } },
      review: {
        select: { id: true, rating: true, comment: true, createdAt: true },
      },
    },
    take: 100,
  });
}
