import { Component } from "@angular/core";
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { EmailService } from "../../services/email/email.service";
import { LoaderComponent } from "../../shared/loader/loader.component";
import { ModalComponent } from "../../shared/modal/modal.component";

@Component({
  selector: "app-contact-me",
  standalone: true,
  imports: [ReactiveFormsModule, LoaderComponent, ModalComponent],
  templateUrl: "./contact-me.component.html",
  styleUrl: "./contact-me.component.scss",
})
export class ContactMeComponent {
  isLoading = false;
  isEmailSend = false;
  isEmailKO = false;

  mailForm = new FormGroup({
    email: new FormControl<string>("", [Validators.required, Validators.email]),
    subject: new FormControl<string>("", Validators.required),
    message: new FormControl<string>("", Validators.required),
  });

  constructor(private emailService: EmailService) {}

  sendEmail() {
    this.isLoading = true;
    this.emailService
      .sendEmail(this.mailForm.get("email")?.value!, this.mailForm.get("subject")?.value!, this.mailForm.get("message")?.value!)
      .subscribe({
        next: (resp) => {
          this.isLoading = false;
          this.isEmailSend = true;
          console.log("Email sent ", resp);
        },
        error: (err) => {
          this.isLoading = false;
          this.isEmailKO = true;
          console.error("An error occurred :", err);
        },
        complete: () => {
          this.mailForm.reset();
          console.log("There are no more action happen.");
        },
      });
  }
}
