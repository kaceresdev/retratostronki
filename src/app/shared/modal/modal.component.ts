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
  modal: any;
  @Input() icon: string = "";
  @Input() text: string = "";
  @Output() closeModalEv = new EventEmitter<void>();

  constructor(private renderer: Renderer2, private el: ElementRef) {}

  ngOnInit(): void {
    this.modal = this.el.nativeElement.querySelector("#modal");
    this.renderer.listen(this.modal, "click", (event) => {
      if (event.target === this.modal) {
        this.closeModal();
      }
    });
  }

  closeModal(): void {
    this.renderer.setStyle(this.modal, "display", "none");
    this.closeModalEv.emit();
  }
}
