import Link from "next/link"
import { buttonClass } from "@/app/components/ui/button"
import { PageHeader } from "@/app/components/ui/page-header"
import { getItems } from "@/app/db/item"
import { InventoryBrowser } from "./inventory-browser"

const Inventory = async ({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>
}) => {
  const { status } = await searchParams
  const items = await getItems()

  return (
    <div className="mx-auto flex max-w-[1280px] flex-col gap-8 px-6 py-10 md:px-10">
      <PageHeader
        title="Inventory"
        description="Every record the café owns, holds on loan, or has been given. Filter by format, owner, status, or condition."
        actions={
          <Link href="/add-item" className={buttonClass("primary", "md")}>
            Check in a record
          </Link>
        }
      />
      <InventoryBrowser items={items} initialStatus={status ?? "all"} />
    </div>
  )
}

export default Inventory
