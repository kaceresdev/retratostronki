import { Component } from "@angular/core";

@Component({
  selector: "app-street-photography",
  standalone: true,
  imports: [],
  templateUrl: "./street-photography.component.html",
  styleUrl: "./street-photography.component.scss",
})
export class StreetPhotographyComponent {
  // TODO: Dinamizar
  menuItems = ["Todas", "2023", "2024"];
  activeTab: string = this.menuItems[0];
  // TODO: Dinamizar
  photoFolders = [
    {
      image: "contact.jpg",
      location: "Galapagar - Valdemorillo",
      date: "12/04/2024",
    },
    {
      image: "contact.jpg",
      location: "Galapagar - Valdemorillo",
      date: "12/04/2024",
    },
    {
      image: "contact.jpg",
      location: "Galapagar - Valdemorillo",
      date: "12/04/2023",
    },
    {
      image: "contact.jpg",
      location: "Galapagar - Valdemorillo",
      date: "12/04/2023",
    },
  ];
  photoFoldersFiltered = this.photoFolders;

  filter(year: string) {
    this.activeTab = year;
    if (year === "Todas") {
      this.photoFoldersFiltered = this.photoFolders;
    } else {
      this.photoFoldersFiltered = this.photoFolders.filter((folder) => {
        const folderYear = folder.date.split("/")[2];
        return folderYear === year;
      });
    }
  }
}
