"use client"
import { useActionState, useState } from "react"
import { searchAlbum } from "../lib/add-item/searchAlbum"

const AddItem = () => {
  const [state, action, isLoading] = useActionState(searchAlbum, undefined)
  const [formatName, setFormatName] = useState<string>("")
  const handleFormatName = (name: string) => {
    setFormatName(name)
  }
  return (
    <main className="bg-[#E9E3C8] w-full p-10 min-h-screen">
      <h1 className="font-bevan font-medium italic text-6xl">Add an Item</h1>
      <section>
        <form action={action}>
          <div className="flex">
            <button className="" type="button" onClick={() => handleFormatName('LP')}>vinyl</button>
            <button className="" type="button" onClick={() => handleFormatName('CD')}>cd</button>
            <input name="format" value={formatName} type="hidden" />
          </div>
          <div>
            <h2>search discogs</h2>
            <div>
              <input name="searchAlbum" type='text' placeholder="LUX - Rosalia" />
              <button>search</button>
            </div>
          </div>
        </form>
      </section>
    </main>
  )
}

export default AddItem

