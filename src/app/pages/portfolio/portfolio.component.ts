import { NgOptimizedImage } from "@angular/common";
import { Component, ElementRef, OnInit, QueryList, ViewChildren } from "@angular/core";

@Component({
  selector: "app-portfolio",
  standalone: true,
  imports: [NgOptimizedImage],
  templateUrl: "./portfolio.component.html",
  styleUrl: "./portfolio.component.scss",
})
export class PortfolioComponent implements OnInit {
  @ViewChildren("imageElement") imageElements!: QueryList<ElementRef>;

  handleKeyPressFn: any;

  currentImageIndex: number = 0;
  isViewerOpen: boolean = false;
  zoomScale: number = 1;

  ngOnInit(): void {
    this.handleKeyPressFn = this._handleKeyPress.bind(this);
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
    this.currentImageIndex = (this.currentImageIndex + 1) % this.imageElements.length;
    this.resetZoom();
    this.updateViewer(this.currentImageIndex);
  }

  /**
   * Muestra la imagen anterior.
   */
  prevImage(): void {
    this.currentImageIndex = (this.currentImageIndex - 1 + this.imageElements.length) % this.imageElements.length;
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
    console.log(event);

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
}
