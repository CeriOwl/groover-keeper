import axios from "axios"

export async function searchAlbum(initial: unknown, formState: FormData) {
  const albumName = formState.get("searchAlbum")
  const format = formState.get("format")
  const { data } = await axios.get(`https://api.discogs.com/database/search?q=${albumName}&format=${format}`, {
    headers: {
      "User-Agent": "Goover-Keeper/1.0 +https://github.com/CeriOwl/groover-keeper"
    }
  })
  console.log(data)
}
