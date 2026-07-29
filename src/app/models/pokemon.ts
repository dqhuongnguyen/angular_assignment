// The list endpoint (GET /pokemon?offset=&limit=) only gives back a name
// and a "detail" URL per entry - no sprite, no id as its own field. But
// the id is sitting right there in the URL (".../pokemon/25/"), and the
// official sprite CDN is predictable from that id, so we can build a full
// card's worth of data without an extra request per Pokemon.
export interface PokeApiListEntry {
  name: string;
  url: string;
}

export interface PokeApiListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: PokeApiListEntry[];
}

// Shape for a single Pokemon lookup (GET /pokemon/{name}), used by search.
export interface PokeApiDetail {
  id: number;
  name: string;
  height: number;
  weight: number;
  types: { slot: number; type: { name: string } }[];
}

export interface PokemonCard {
  id: number;
  name: string;
  spriteUrl: string;
  types?: string[];
}
