import { Routes } from "@angular/router";
import { HomeComponent } from "./pages/home/home.component";
import { AboutMeComponent } from "./pages/about-me/about-me.component";
import { ContactMeComponent } from "./pages/contact-me/contact-me.component";

export const routes: Routes = [
  { path: "", component: HomeComponent, pathMatch: "full" },
  { path: "about-me", component: AboutMeComponent, pathMatch: "full" },
  { path: "contact-me", component: ContactMeComponent, pathMatch: "full" },
];
