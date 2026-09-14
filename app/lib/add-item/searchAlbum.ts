import axios from "axios"

export interface DiscogsSearchResult {
  id: number
  type: string
  master_id?: number
  master_url?: string
  uri: string
  title: string
  thumb: string
  cover_image: string
  resource_url: string
  community?: { want: number; have: number }
  format?: string[]
  country?: string
  year?: string
  label?: string[]
  genre?: string[]
  style?: string[]
  barcode?: string[]
  catno?: string
}

export interface DiscogsSearchResponse {
  pagination: {
    page: number
    pages: number
    per_page: number
    items: number
  }
  results: DiscogsSearchResult[]
}

const formatParam = (format: string) => {
  const normalized = format.toLowerCase()
  if (normalized === "vinyl") return "Vinyl"
  if (normalized === "cd") return "CD"
  return undefined
}

export async function searchAlbum(
  albumName: string,
  format: string,
): Promise<DiscogsSearchResponse> {
  const { data } = await axios.get<DiscogsSearchResponse>(
    "https://api.discogs.com/database/search",
    {
      params: {
        q: albumName,
        format: formatParam(format),
        per_page: 20
      },
      headers: {
        "User-Agent":
          "Groover-Keeper/1.0 +https://github.com/CeriOwl/groover-keeper",
      },
    },
  )
  return data
}
