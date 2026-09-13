export type MediaFormat =
  | 'Vinyl LP (12")'
  | 'Vinyl EP (7")'
  | "CD"
  | "Cassette"

export type Ownership = "house" | "loan" | "donation"

export type ItemStatus =
  | "in-collection"
  | "playing"
  | "on-loan"
  | "reclaimed"
  | "repair"
  | "missing"

export type Condition =
  | "Mint"
  | "Near Mint"
  | "Very Good Plus"
  | "Very Good"
  | "Good"
  | "Fair"

export interface ItemView {
  id: string
  title: string
  artist: string
  year: number
  genre: string
  label: string
  format: MediaFormat
  condition: Condition
  status: ItemStatus
  location: string
  ownership: Ownership
  ownerName: string
  ownerContact?: string
  addedAt: string
  notes?: string
  cover: string
  discogsId?: number
}

export interface ActivityEntry {
  id: string
  itemId: string
  itemTitle: string
  action: string
  staff: string
  note?: string
  createdAt: string
}

// TODO(schema): ownership is derived until the DB gets an acquisition_type
// column. The café's own records are represented by a reserved owner row.
export const HOUSE_OWNER = "Groove Keeper — House Collection"

export const getOwnership = (ownerName: string): Ownership => {
  if (ownerName === HOUSE_OWNER) return "house"
  if (ownerName.toLowerCase().includes("donat")) return "donation"
  return "loan"
}

export const ownershipMeta: Record<
  Ownership,
  { label: string; short: string; tone: "ink" | "rust" | "signal" }
> = {
  house: { label: "House copy", short: "House", tone: "ink" },
  loan: { label: "On loan", short: "Loan", tone: "rust" },
  donation: { label: "Donated", short: "Donation", tone: "signal" },
}

export const statusMeta: Record<
  ItemStatus,
  { label: string; tone: "paper" | "signal" | "ink" | "rust" }
> = {
  "in-collection": { label: "In collection", tone: "paper" },
  playing: { label: "On the turntable", tone: "signal" },
  "on-loan": { label: "On loan", tone: "rust" },
  reclaimed: { label: "Reclaimed", tone: "paper" },
  repair: { label: "In repair", tone: "paper" },
  missing: { label: "Missing", tone: "rust" },
}

export const formats: MediaFormat[] = [
  'Vinyl LP (12")',
  'Vinyl EP (7")',
  "CD",
  "Cassette",
]

export const formatShort: Record<MediaFormat, string> = {
  'Vinyl LP (12")': "LP",
  'Vinyl EP (7")': "EP",
  CD: "CD",
  Cassette: "Tape",
}

export const conditions: Condition[] = [
  "Mint",
  "Near Mint",
  "Very Good Plus",
  "Very Good",
  "Good",
  "Fair",
]

export const isInBuilding = (status: ItemStatus) =>
  status === "in-collection" || status === "playing" || status === "repair"

export const isOut = (status: ItemStatus) =>
  status === "on-loan" || status === "reclaimed"
