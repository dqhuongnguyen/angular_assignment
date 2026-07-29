import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';

import { PokeCatalog } from './poke-catalog';

describe('PokeCatalog', () => {
  let service: PokeCatalog;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(PokeCatalog);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('builds a sprite URL from the id embedded in the result URL', () => {
    let page: any;
    service.getPage(0, 2).subscribe((res) => (page = res));

    const req = httpMock.expectOne((r) => r.url.includes('pokeapi.co/api/v2/pokemon'));
    req.flush({
      count: 1302,
      next: 'https://pokeapi.co/api/v2/pokemon?offset=2&limit=2',
      previous: null,
      results: [
        { name: 'bulbasaur', url: 'https://pokeapi.co/api/v2/pokemon/1/' },
        { name: 'ivysaur', url: 'https://pokeapi.co/api/v2/pokemon/2/' },
      ],
    });

    expect(page.total).toBe(1302);
    expect(page.pokemon.length).toBe(2);
    expect(page.pokemon[0].id).toBe(1);
    expect(page.pokemon[0].spriteUrl).toContain('/1.png');
  });

  it('looks up a single Pokemon by name and sorts its types by slot', () => {
    let found: any;
    service.findByName('Pikachu').subscribe((res) => (found = res));

    const req = httpMock.expectOne((r) => r.url.includes('/pokemon/pikachu'));
    req.flush({
      id: 25,
      name: 'pikachu',
      height: 4,
      weight: 60,
      types: [
        { slot: 1, type: { name: 'electric' } },
      ],
    });

    expect(found.id).toBe(25);
    expect(found.types).toEqual(['electric']);
  });

  it('lowercases the search term before hitting the API', () => {
    service.findByName('  Charizard  ').subscribe();
    const req = httpMock.expectOne((r) => r.url.endsWith('/pokemon/charizard'));
    req.flush({ id: 6, name: 'charizard', height: 17, weight: 905, types: [] });
  });
});
