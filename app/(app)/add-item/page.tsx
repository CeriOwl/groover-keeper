import { PageHeader } from "@/app/components/ui/page-header"
import { AddItemForm } from "./add-item-form"

const AddItem = () => {
  return (
    <div className="mx-auto flex max-w-[1000px] flex-col gap-8 px-6 py-10 md:px-10">
      <PageHeader
        title="Add a record"
        description="Search for the release, then tell us who owns it and where it lives."
      />
      <AddItemForm />
    </div>
  )
}

export default AddItem
