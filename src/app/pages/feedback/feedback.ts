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

  // Kept the field list short on purpose - name, email, a rating, and an
  // optional comment. Anything longer starts to feel like a job application.
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

    // There's no backend behind this yet - the point of this page is the
    // form and its validation, not a database. Logging it is enough to
    // prove the values actually made it out of the form.
    console.log('Feedback submitted:', this.form.value);

    this.submitted.set(true);
    this.form.reset();
  }

  giveAnotherAnswer(): void {
    this.submitted.set(false);
  }
}
