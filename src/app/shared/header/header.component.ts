import { Component } from "@angular/core";
import { RouterLink } from "@angular/router";

@Component({
  selector: "app-header",
  standalone: true,
  imports: [RouterLink],
  templateUrl: "./header.component.html",
  styleUrl: "./header.component.scss",
})
export class HeaderComponent {
  menuItems = [
    {
      title: "Home",
      route: "/",
    },
    {
      title: "Sobre mí",
      route: "/about-me",
    },
    {
      title: "Contacto",
      route: "/contact",
    },
    {
      title: "Sesiones Fotográficas",
      route: "/photosessions",
    },
  ];

  toggleNavIcon() {
    const nav = document.getElementById("nav-icon");
    const menu = document.getElementById("menu");
    const header = document.getElementById("header");
    nav!.classList.toggle("open");
    menu!.classList.toggle("show");
    menu!.style.display = menu!.style.display === "block" ? "none" : "block";
    header!.classList.toggle("hidden");

    // Evitar el desplazamiento vertical del contenido de la página BODY y HTML
    document.documentElement.style.overflowY = menu!.style.display === "block" ? "hidden" : "auto";
    document.body.style.overflowY = menu!.style.display === "block" ? "hidden" : "auto";
  }
}
