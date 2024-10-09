import { Component, OnInit } from "@angular/core";
import { GoogleDriveService } from "../../services/google-drive/google-drive.service";
import { firstValueFrom } from "rxjs";

@Component({
  selector: "app-street-photography",
  standalone: true,
  imports: [],
  templateUrl: "./street-photography.component.html",
  styleUrl: "./street-photography.component.scss",
})
export class StreetPhotographyComponent implements OnInit {
  menuItems = JSON.parse(localStorage.getItem("googleDriveFolders")!)
    .folders.filter((folder: { id: string; name: string }) => folder.name === "Fotos Calle")[0]
    .childs.map((item: { id: string; name: any }) => item.name);
  activeTab: string = "";
  streetPhotosFolder: any;
  previewImages: any[] = [];
  photoFolders: any[] = [];
  photoFoldersFiltered: any[] = [];

  constructor(private googleDriveService: GoogleDriveService) {}

  async ngOnInit(): Promise<void> {
    this.menuItems.push("Todas");
    this.menuItems = this.sortedMenuItems(this.menuItems);
    this.activeTab = this.menuItems[0];

    this.streetPhotosFolder = this._findPrincipalFolder("Fotos Calle");

    await this._getPreviewImages();
    this._transformInfo(this.streetPhotosFolder.childs);
  }

  sortedMenuItems(menuItems: string[]): string[] {
    return menuItems.sort((a, b) => {
      if (a === "Todas") return -1; // Mueve 'Todas' al inicio
      if (b === "Todas") return 1; // Mueve 'Todas' al inicio
      return a.localeCompare(b); // Ordena el resto cronológicamente
    });
  }

  private _findPrincipalFolder(folderName: string) {
    return JSON.parse(localStorage.getItem("googleDriveFolders")!).folders.find((folder: any) => folder.name === folderName);
  }

  private _findPreviewFolders(folders: any[]): any[] {
    let previews: any[] = [];

    folders.forEach((folder) => {
      if (folder.name === "*preview*") {
        previews.push(folder);
      }
      // Si el objeto tiene hijos, llama recursivamente a la función
      if (folder.childs) {
        previews = previews.concat(this._findPreviewFolders(folder.childs));
      }
    });

    return previews;
  }

  private async _getPreviewImages(): Promise<void> {
    let previewsFoldersFound = this._findPreviewFolders(this.streetPhotosFolder.childs);

    const promises = previewsFoldersFound.map((preview) => firstValueFrom(this.googleDriveService.getImages(preview.id)));

    try {
      const results = await Promise.all(promises);
      results.forEach((res) => {
        if (res && res.files) {
          res.files = this._adjustThumbnailResolution(res.files, 800);
          this.previewImages.push(...res.files);
        }
      });
    } catch (err) {
      console.error("Error al obtener las imágenes de vista previa:", err);
    }
  }

  private _transformInfo(folders: any[]) {
    let noPreviews: any[] = [];

    folders.forEach((folder) => {
      folder.childs.forEach((child: { id: string; name: string; description?: string }) => {
        if (child.name !== "*preview*") {
          noPreviews.push(child);
        }
      });
    });

    noPreviews.forEach((item1) => {
      this.previewImages.forEach((item2) => {
        // Compara el nombre sin la extensión utilizando una expresión regular
        const item2NameWithoutExtension = item2.name.replace(/\.[^/.]+$/, "");

        if (item1.name === item2NameWithoutExtension) {
          item1.thumbnailLink = item2.thumbnailLink;
        }
      });
    });

    this.photoFolders = noPreviews;
    this.photoFoldersFiltered = this.photoFolders;
  }

  filter(year: string) {
    this.activeTab = year;
    if (year === "Todas") {
      this.photoFoldersFiltered = this.photoFolders;
    } else {
      this.photoFoldersFiltered = this.photoFolders.filter((folder) => {
        const folderYear = folder.name.split("/")[2];
        return folderYear === year;
      });
    }
  }

  private _adjustThumbnailResolution(images: any[], resolution = 800) {
    return images.map((image) => {
      return {
        ...image,
        // Cambia cualquier tamaño existente en thumbnailLink por el valor de la resolución
        thumbnailLink: image.thumbnailLink.replace(/=s\d+/, `=s${resolution}`),
      };
    });
  }
}
