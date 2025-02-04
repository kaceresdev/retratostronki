import { Component, ElementRef, HostListener, OnInit, QueryList, ViewChildren } from "@angular/core";
import { ActivatedRoute, Router, RouterLink } from "@angular/router";
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
  @ViewChildren("imageElement") imageElements!: QueryList<ElementRef>;

  handleKeyPressFn: any;

  currentUrl = "";
  photoFiles: any[] = [];
  idFolder = "";
  nextPageToken = "";
  info: any;
  isLoading = false;

  currentImageIndex: number = 0;
  isViewerOpen: boolean = false;
  zoomScale: number = 1;

  constructor(private router: Router, private activatedRoute: ActivatedRoute, private googleDriveService: GoogleDriveService) {
    this.currentUrl = this.router.url.split("/")[1];
    this.handleKeyPressFn = this._handleKeyPress.bind(this);
  }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params) => {
      this.idFolder = params["id"];
      this.getImagesPage();
    });
    this.activatedRoute.paramMap.pipe(map(() => window.history.state)).subscribe((state) => {
      this.info = state;
    });
  }

  getImagesPage() {
    this.isLoading = true;
    this.googleDriveService.getImages(this.idFolder, this.nextPageToken).subscribe((images) => {
      this.nextPageToken = images.nextPageToken;
      if (images.files.length === 0) {
        this.isLoading = false;
      } else {
        images.files.forEach((res: any) => {
          res = this._adjustThumbnail(res, 800);
          this.photoFiles.push(res);
          this.isLoading = false;
        });
      }
    });
  }

  private _adjustThumbnail(image: any, resolution = 800) {
    return {
      ...image,
      thumbnailLink: environment.urlBaseServer + "/proxy-drive" + image.thumbnailLink.split("/drive-storage")[1].replace(/=s\d+/, `=s${resolution}`),
    };
  }

  /**
   * Abre el visor con la imagen seleccionada.
   * @param index índice de la imagen seleccionada.
   */
  openViewer(index: number): void {
    this.currentImageIndex = index;
    this.isViewerOpen = true;
    document.addEventListener("keydown", this.handleKeyPressFn);
    document.documentElement.style.overflowY = "hidden";
    document.body.style.overflowY = "hidden";
  }

  /**
   * Go to contact with information
   */
  toContact(name: string) {
    const nameFormated = name.split("/").pop();
    this.closeViewer();
    this.router.navigate(["/contact-me"], { state: { img: this.info.name + " (" + this.info.description + ") -> " + nameFormated } });
  }

  /**
   * Cierra el visor de imágenes.
   */
  closeViewer(): void {
    this.isViewerOpen = false;
    this.zoomScale = 1;
    document.body.style.overflow = "";
    document.removeEventListener("keydown", this.handleKeyPressFn);
    document.documentElement.style.overflowY = "auto";
    document.body.style.overflowY = "auto";
  }

  /**
   * Muestra la imagen siguiente.
   */
  nextImage(): void {
    this.currentImageIndex = (this.currentImageIndex + 1) % this.photoFiles.length;
    this.resetZoom();
    this.updateViewer(this.currentImageIndex);
  }

  /**
   * Muestra la imagen anterior.
   */
  prevImage(): void {
    this.currentImageIndex = (this.currentImageIndex - 1 + this.photoFiles.length) % this.photoFiles.length;
    this.resetZoom();
    this.updateViewer(this.currentImageIndex);
  }

  /**
   * Función que mueve el scroll para encontrarse siempre en la vista de la imagen que se está
   * visualizando en el visualizador
   * @param index de la imagen que se está visualizando
   */
  updateViewer(index: number): void {
    this.imageElements.forEach((img, i) => {
      const element = img.nativeElement;
      if (i === index) {
        element.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    });
  }

  /**
   * Maneja las teclas de flechas y escape.
   * @param event evento de teclado.
   */
  private _handleKeyPress(event: KeyboardEvent): void {
    if (event.key === "Escape") {
      this.closeViewer();
    } else if (event.key === "ArrowRight") {
      this.nextImage();
    } else if (event.key === "ArrowLeft") {
      this.prevImage();
    }
  }

  /**
   * Detecta la rueda del ratón para hacer zoom.
   * @param event evento de la rueda del ratón.
   */
  onWheel(event: WheelEvent): void {
    event.preventDefault();
    const zoomIntensity = 0.1;
    const delta = event.deltaY > 0 ? -zoomIntensity : zoomIntensity;
    this.zoomScale = Math.min(Math.max(1, this.zoomScale + delta), 2);
  }

  /**
   * Resetea el zoom y la posición de la imagen.
   */
  resetZoom(): void {
    this.zoomScale = 1;
  }

  scrollToTop() {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  @HostListener("window:scroll", [])
  onWindowScroll() {
    const scrollToTopBtn = document.getElementById("btnToTop");
    const scrollPosition = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;

    if (scrollPosition > 150) {
      scrollToTopBtn!.classList.add("show");
    } else {
      scrollToTopBtn!.classList.remove("show");
    }
  }
}
