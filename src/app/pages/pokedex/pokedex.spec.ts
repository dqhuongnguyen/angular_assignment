import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';

import { Pokedex } from './pokedex';

describe('Pokedex', () => {
  let component: Pokedex;
  let fixture: ComponentFixture<Pokedex>;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Pokedex],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(Pokedex);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  function flushFirstPage(count = 1302, results: unknown[] = [{ name: 'bulbasaur', url: 'https://pokeapi.co/api/v2/pokemon/1/' }]) {
    const req = httpMock.expectOne((r) => r.url.includes('/pokemon') && !r.url.includes('/pokemon/'));
    req.flush({ count, next: null, previous: null, results });
  }

  it('should create', () => {
    fixture.detectChanges();
    flushFirstPage();
    expect(component).toBeTruthy();
  });

  it('loads the first page of 20 on init and exposes the total count', () => {
    fixture.detectChanges();
    flushFirstPage();

    expect(component.pokemon().length).toBe(1);
    expect(component.total()).toBe(1302);
    expect(component.pageNumber).toBe(1);
    expect(component.hasPrevious).toBe(false);
    expect(component.hasNext).toBe(true);
  });

  it('moves forward a page when nextPage is called', () => {
    fixture.detectChanges();
    flushFirstPage();

    component.nextPage();
    const req = httpMock.expectOne((r) => r.urlWithParams.includes('offset=20'));
    req.flush({ count: 1302, next: null, previous: null, results: [] });

    expect(component.offset()).toBe(20);
  });

  it('does not go below page one', () => {
    fixture.detectChanges();
    flushFirstPage();

    component.previousPage();
    httpMock.expectNone((r) => r.urlWithParams.includes('offset=-20'));
    expect(component.offset()).toBe(0);
  });

  it('shows a not-found message when a search comes back empty-handed', () => {
    fixture.detectChanges();
    flushFirstPage();

    component.searchTerm = 'notarealpokemon';
    component.onSearch();

    const req = httpMock.expectOne((r) => r.url.includes('/pokemon/notarealpokemon'));
    req.flush('not found', { status: 404, statusText: 'Not Found' });

    expect(component.errorMessage()).toContain('notarealpokemon');
    expect(component.pokemon().length).toBe(0);
  });
});
