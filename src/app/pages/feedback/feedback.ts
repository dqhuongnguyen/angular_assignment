import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-feedback',
  imports: [ReactiveFormsModule],
  templateUrl: './feedback.html',
  styleUrl: './feedback.scss',
})
export class Feedback {
  private fb = inject(FormBuilder);

  submitted = signal(false);

  form = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    rating: ['', [Validators.required]],
    comments: ['', [Validators.maxLength(500)]],
  });

  get name() {
    return this.form.get('name');
  }

  get email() {
    return this.form.get('email');
  }

  get rating() {
    return this.form.get('rating');
  }

  get comments() {
    return this.form.get('comments');
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    console.log('Feedback submitted:', this.form.value);

    this.submitted.set(true);
    this.form.reset();
  }

  giveAnotherAnswer(): void {
    this.submitted.set(false);
  }
}
