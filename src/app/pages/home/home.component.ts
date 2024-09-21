import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-home",
  standalone: true,
  imports: [],
  templateUrl: "./home.component.html",
  styleUrl: "./home.component.scss",
})
export class HomeComponent implements OnInit {
  images: string[] = ["assets/imgs/principal_1.jpg", "assets/imgs/principal_2.jpg", "assets/imgs/principal_3.jpg", "assets/imgs/principal_4.jpg"];

  currentImageIndex = 0;

  ngOnInit(): void {
    this.startImageCarousel();
  }

  startImageCarousel(): void {
    setInterval(() => {
      this.currentImageIndex = (this.currentImageIndex + 1) % this.images.length;
    }, 5000);
  }
}
