import { NgIf } from "@angular/common";
import { Component, ElementRef, EventEmitter, Input, OnInit, Output, Renderer2 } from "@angular/core";

@Component({
  selector: "app-modal",
  standalone: true,
  imports: [],
  templateUrl: "./modal.component.html",
  styleUrl: "./modal.component.scss",
})
export class ModalComponent implements OnInit {
  @Input() icon: string = "";
  @Input() text: string = "";
  @Output() closeModal = new EventEmitter<void>();

  constructor(private renderer: Renderer2, private el: ElementRef) {}

  ngOnInit(): void {
    const modal = this.el.nativeElement.querySelector("#modal");
    this.renderer.listen(modal, "click", (event) => {
      if (event.target === modal) {
        this.renderer.setStyle(modal, "display", "none");
        this.closeModal.emit();
      }
    });
  }
}
