import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Route, Router, RouterLink } from "@angular/router";
import { GoogleDriveService } from "../../../services/google-drive/google-drive.service";
import { environment } from "../../../../environments/environment";
import { map } from "rxjs";
import { NgOptimizedImage } from "@angular/common";
import { LoaderComponent } from "../../../shared/loader/loader.component";

@Component({
  selector: "app-images-page",
  standalone: true,
  imports: [RouterLink, NgOptimizedImage, LoaderComponent],
  templateUrl: "./images-page.component.html",
  styleUrl: "./images-page.component.scss",
})
export class ImagesPageComponent implements OnInit {
  currentUrl = "";
  photoFiles: any[] = [];
  info: any;
  isLoading = false;

  constructor(private router: Router, private activatedRoute: ActivatedRoute, private googleDriveService: GoogleDriveService) {
    this.currentUrl = this.router.url.split("/")[1];
  }

  ngOnInit(): void {
    this.isLoading = true;
    this.activatedRoute.params.subscribe((params) => {
      this.googleDriveService.getImages(params["id"]).subscribe((images) => {
        images.files.forEach((res: any) => {
          res = this._adjustThumbnail(res, 800);
          this.photoFiles.push(res);
          this.isLoading = false;
        });
      });
    });
    this.activatedRoute.paramMap.pipe(map(() => window.history.state)).subscribe((state) => {
      this.info = state;
    });
  }

  private _adjustThumbnail(image: any, resolution = 800) {
    return {
      ...image,
      thumbnailLink: environment.urlBaseServer + "/proxy-drive" + image.thumbnailLink.split("/drive-storage")[1].replace(/=s\d+/, `=s${resolution}`),
    };
  }

  scrollToTop() {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
}
