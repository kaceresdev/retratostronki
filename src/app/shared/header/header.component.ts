import { NgClass } from "@angular/common";
import { Component, HostListener, Input } from "@angular/core";
import { NavigationEnd, Router, RouterLink } from "@angular/router";
import { filter } from "rxjs";

@Component({
  selector: "app-header",
  standalone: true,
  imports: [RouterLink, NgClass],
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
      title: "Portfolio",
      route: "/portfolio",
    },
    {
      title: "Fotografías Calle",
      route: "/street-photography",
    },
    {
      title: "Eventos",
      route: "/events",
    },
    {
      title: "Contacto",
      route: "/contact-me",
    },
    // {
    //   title: "Sessiones privadas",
    //   route: "/private-sessions",
    // },
  ];
  cristalType: boolean = false;
  isTop: boolean = false;

  constructor(private router: Router) {
    this.router.events.pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd)).subscribe((event: NavigationEnd) => {
      const currentUrl = event.urlAfterRedirects;
      if (currentUrl === "/") {
        this.cristalType = true;
        this.isTop = true;
      } else {
        this.cristalType = false;
        this.isTop = false;
      }
    });
  }

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

  scrollToTop(route?: string) {
    if (this.router.url === route) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      window.scrollTo({ top: 0 });
    }
  }

  @HostListener("window:scroll", [])
  onWindowScroll() {
    if (this.cristalType) {
      const scrollPosition = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;

      // Define el valor en píxeles desde el que quieres que se aplique el cambio
      if (scrollPosition > 0) {
        this.isTop = false;
      } else {
        this.isTop = true;
      }
    }
  }
}
