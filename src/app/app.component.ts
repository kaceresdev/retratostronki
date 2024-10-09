import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterOutlet } from "@angular/router";
import { HeaderComponent } from "./shared/header/header.component";
import { FooterComponent } from "./shared/footer/footer.component";
import { GoogleDriveService } from "./services/google-drive/google-drive.service";

@Component({
  selector: "app-root",
  standalone: true,
  imports: [CommonModule, RouterOutlet, HeaderComponent, FooterComponent],
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent implements OnInit {
  title = "retratostronki";

  constructor(private googleDriveService: GoogleDriveService) {}

  ngOnInit(): void {
    this.googleDriveService.listFolders().subscribe({
      next: (res) => {
        localStorage.setItem("googleDriveFolders", JSON.stringify(res));
      },
      error: (err) => {},
      complete: () => {},
    });
  }
}
