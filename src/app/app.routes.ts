import { Routes } from "@angular/router";
import { HomeComponent } from "./pages/home/home.component";
import { AboutMeComponent } from "./pages/about-me/about-me.component";
import { ContactMeComponent } from "./pages/contact-me/contact-me.component";
import { StreetPhotographyComponent } from "./pages/street-photography/street-photography.component";
import { EventsComponent } from "./pages/events/events.component";
import { PrivateSessionsComponent } from "./pages/private-sessions/private-sessions.component";

export const routes: Routes = [
  { path: "", component: HomeComponent, pathMatch: "full" },
  { path: "about-me", component: AboutMeComponent, pathMatch: "full" },
  { path: "contact-me", component: ContactMeComponent, pathMatch: "full" },
  { path: "street-photography", component: StreetPhotographyComponent, pathMatch: "full" },
  { path: "events", component: EventsComponent, pathMatch: "full" },
  { path: "private-sessions", component: PrivateSessionsComponent, pathMatch: "full" },
];
