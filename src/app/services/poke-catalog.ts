import { Service, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

import { PokeApiListResponse, PokeApiDetail, PokemonCard } from '../models/pokemon';

const API_BASE = 'https://pokeapi.co/api/v2';
const SPRITE_BASE = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon';

@Service()
export class PokeCatalog {
  private http = inject(HttpClient);

  // Real offset/limit pagination straight from the API - there are over
  // 1300 entries, so "page 1 of ~109" is a real, honest number here.
  getPage(offset: number, limit: number): Observable<{ pokemon: PokemonCard[]; total: number }> {
    return this.http
      .get<PokeApiListResponse>(`${API_BASE}/pokemon`, {
        params: { offset: String(offset), limit: String(limit) },
      })
      .pipe(
        map((res) => ({
          pokemon: res.results.map(toCard),
          total: res.count,
        })),
      );
  }

  // Single-name lookup for the search box. PokeAPI doesn't do fuzzy or
  // partial matching, so this only works for an exact (case-insensitive)
  // name - "pikachu" works, "pika" won't, and that's worth explaining to
  // the user in the UI rather than pretending it's a full search engine.
  findByName(name: string): Observable<PokemonCard> {
    const slug = name.trim().toLowerCase();
    return this.http.get<PokeApiDetail>(`${API_BASE}/pokemon/${slug}`).pipe(
      map((detail) => ({
        id: detail.id,
        name: detail.name,
        spriteUrl: spriteUrl(detail.id),
        types: detail.types.sort((a, b) => a.slot - b.slot).map((t) => t.type.name),
      })),
    );
  }
}

function idFromUrl(url: string): number {
  // Result URLs look like https://pokeapi.co/api/v2/pokemon/25/
  const match = url.match(/\/pokemon\/(\d+)\/?$/);
  return match ? Number(match[1]) : 0;
}

function spriteUrl(id: number): string {
  return `${SPRITE_BASE}/${id}.png`;
}

function toCard(entry: { name: string; url: string }): PokemonCard {
  const id = idFromUrl(entry.url);
  return { id, name: entry.name, spriteUrl: spriteUrl(id) };
}
