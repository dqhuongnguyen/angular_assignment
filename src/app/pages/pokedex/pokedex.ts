import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { PokeCatalog } from '../../services/poke-catalog';
import { PokemonCard } from '../../models/pokemon';

const PAGE_SIZE = 20;

@Component({
  selector: 'app-pokedex',
  imports: [FormsModule],
  templateUrl: './pokedex.html',
  styleUrl: './pokedex.scss',
})
export class Pokedex implements OnInit {
  private catalog = inject(PokeCatalog);

  pokemon = signal<PokemonCard[]>([]);
  loading = signal(false);
  errorMessage = signal<string | null>(null);
  offset = signal(0);
  total = signal(0);

  searchTerm = '';
  // Set once a search is active, so we know to show "back to browsing"
  // instead of pagination controls.
  private searching = false;

  get pageNumber(): number {
    return Math.floor(this.offset() / PAGE_SIZE) + 1;
  }

  get pageCount(): number {
    return Math.max(1, Math.ceil(this.total() / PAGE_SIZE));
  }

  get hasPrevious(): boolean {
    return this.offset() > 0;
  }

  get hasNext(): boolean {
    return this.offset() + PAGE_SIZE < this.total();
  }

  ngOnInit(): void {
    this.loadPage(0);
  }

  onSearch(): void {
    const term = this.searchTerm.trim();
    if (!term) {
      return;
    }

    this.searching = true;
    this.loading.set(true);
    this.errorMessage.set(null);

    this.catalog.findByName(term).subscribe({
      next: (result) => {
        this.pokemon.set([result]);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        this.pokemon.set([]);
        this.errorMessage.set(`Couldn't find a Pokemon named "${term}". Check the spelling and try again.`);
      },
    });
  }

  backToBrowsing(): void {
    this.searching = false;
    this.searchTerm = '';
    this.loadPage(0);
  }

  nextPage(): void {
    if (this.hasNext) {
      this.loadPage(this.offset() + PAGE_SIZE);
    }
  }

  previousPage(): void {
    if (this.hasPrevious) {
      this.loadPage(Math.max(0, this.offset() - PAGE_SIZE));
    }
  }

  get isSearching(): boolean {
    return this.searching;
  }

  private loadPage(offset: number): void {
    this.loading.set(true);
    this.errorMessage.set(null);

    this.catalog.getPage(offset, PAGE_SIZE).subscribe({
      next: ({ pokemon, total }) => {
        this.pokemon.set(pokemon);
        this.total.set(total);
        this.offset.set(offset);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        this.errorMessage.set('The Pokedex API did not respond. Give it a moment and try again.');
      },
    });
  }
}
