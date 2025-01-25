import { Routes } from "@angular/router";
import { HomeComponent } from "./pages/home/home.component";
import { AboutMeComponent } from "./pages/about-me/about-me.component";
import { ContactMeComponent } from "./pages/contact-me/contact-me.component";
import { PreviewPageComponent } from "./pages/preview-page/preview-page.component";
import { PrivateSessionsComponent } from "./pages/private-sessions/private-sessions.component";
import { ImagesPageComponent } from "./pages/preview-page/images-page/images-page.component";
import { PortfolioComponent } from "./pages/portfolio/portfolio.component";

export const routes: Routes = [
  { path: "", component: HomeComponent, pathMatch: "full" },
  { path: "about-me", component: AboutMeComponent, pathMatch: "full" },
  { path: "portfolio", component: PortfolioComponent, pathMatch: "full" },
  { path: "street-photography", component: PreviewPageComponent, pathMatch: "full" },
  { path: "street-photography/:id", component: ImagesPageComponent, pathMatch: "full" },
  { path: "events", component: PreviewPageComponent, pathMatch: "full" },
  { path: "events/:id", component: ImagesPageComponent, pathMatch: "full" },
  { path: "contact-me", component: ContactMeComponent, pathMatch: "full" },
  { path: "private-sessions", component: PrivateSessionsComponent, pathMatch: "full" },
];
