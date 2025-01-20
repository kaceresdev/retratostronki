import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { EmailService } from "../../services/email/email.service";
import { LoaderComponent } from "../../shared/loader/loader.component";
import { ModalComponent } from "../../shared/modal/modal.component";
import { ActivatedRoute } from "@angular/router";
import { map } from "rxjs";

@Component({
  selector: "app-contact-me",
  standalone: true,
  imports: [ReactiveFormsModule, LoaderComponent, ModalComponent],
  templateUrl: "./contact-me.component.html",
  styleUrl: "./contact-me.component.scss",
})
export class ContactMeComponent implements OnInit {
  isLoading = false;
  isEmailSend = false;
  isEmailKO = false;
  imgContact: string = "";

  mailForm = new FormGroup({
    email: new FormControl<string>("", [Validators.required, Validators.email]),
    subject: new FormControl<string>("", Validators.required),
    message: new FormControl<string>("", Validators.required),
  });

  constructor(private activatedRoute: ActivatedRoute, private emailService: EmailService) {}

  ngOnInit(): void {
    this.activatedRoute.paramMap.pipe(map(() => window.history.state)).subscribe((state) => {
      this.imgContact = state.img;
    });

    if (this.imgContact) {
      window.scrollTo({ top: 0 });
    }
  }

  sendEmail() {
    this.isLoading = true;
    this.emailService
      .sendEmail(this.mailForm.get("email")?.value!, this.mailForm.get("subject")?.value!, this.mailForm.get("message")?.value!, this.imgContact)
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
