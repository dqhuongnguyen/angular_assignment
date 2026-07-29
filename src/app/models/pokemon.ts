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
