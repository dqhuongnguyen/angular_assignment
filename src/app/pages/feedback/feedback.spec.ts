import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Feedback } from './feedback';

describe('Feedback', () => {
  let component: Feedback;
  let fixture: ComponentFixture<Feedback>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Feedback],
    }).compileComponents();

    fixture = TestBed.createComponent(Feedback);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('starts invalid because the required fields are empty', () => {
    expect(component.form.invalid).toBe(true);
  });

  it('flags a malformed email address', () => {
    component.email?.setValue('not-an-email');
    expect(component.email?.hasError('email')).toBe(true);
  });

  it('becomes valid once name, email and rating are filled in', () => {
    component.form.setValue({
      name: 'Jane Doe',
      email: 'jane@example.com',
      rating: '5',
      comments: '',
    });

    expect(component.form.valid).toBe(true);
  });

  it('does not submit and marks fields touched when invalid', () => {
    component.onSubmit();
    expect(component.submitted()).toBe(false);
    expect(component.name?.touched).toBe(true);
  });

  it('marks submitted true and resets the form on valid submit', () => {
    component.form.setValue({
      name: 'Jane Doe',
      email: 'jane@example.com',
      rating: '5',
      comments: 'Loved being able to page through the whole Pokedex.',
    });

    component.onSubmit();

    expect(component.submitted()).toBe(true);
    expect(component.form.pristine).toBe(true);
  });
});
