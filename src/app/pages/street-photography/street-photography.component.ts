import { Component, OnInit } from "@angular/core";
import { GoogleDriveService } from "../../services/google-drive/google-drive.service";
import { firstValueFrom } from "rxjs";
import { LoaderComponent } from "../../shared/loader/loader.component";
import { environment } from "../../../environments/environment";
import { Router, RouterOutlet } from "@angular/router";

@Component({
  selector: "app-street-photography",
  standalone: true,
  imports: [LoaderComponent, RouterOutlet],
  templateUrl: "./street-photography.component.html",
  styleUrl: "./street-photography.component.scss",
})
export class StreetPhotographyComponent implements OnInit {
  isLoading = false;
  menuItems = JSON.parse(sessionStorage.getItem("googleDriveFolders")!)
    .folders.filter((folder: { id: string; name: string }) => folder.name === "Fotos Calle")[0]
    .childs.map((item: { id: string; name: any }) => item.name);
  activeTab: string = "";
  streetPhotosFolder: any;
  previewImages: any[] = [];
  photoFolders: any[] = [];
  photoFoldersFiltered: any[] = [];

  readonly IMAGE_NO_PREVIEW = "assets/imgs/no_preview2.svg";

  constructor(private googleDriveService: GoogleDriveService, private router: Router) {}

  async ngOnInit(): Promise<void> {
    this.menuItems.push("Todas");
    this.menuItems = this.sortedMenuItems(this.menuItems);
    this.activeTab = this.menuItems[0];

    this.streetPhotosFolder = this._findPrincipalFolder("Fotos Calle");

    // Control para no recuperar la info cada vez que entramos en la pantalla
    if (sessionStorage.getItem("googleDrivePreviewImages")) {
      this.previewImages = JSON.parse(sessionStorage.getItem("googleDrivePreviewImages")!);
    } else {
      await this._getPreviewImages();
    }

    this._transformInfo(this.streetPhotosFolder.childs);
  }

  sortedMenuItems(menuItems: string[]): string[] {
    return menuItems.sort((a, b) => {
      if (a === "Todas") return -1;
      if (b === "Todas") return 1;
      return a.localeCompare(b);
    });
  }

  private _findPrincipalFolder(folderName: string) {
    return JSON.parse(sessionStorage.getItem("googleDriveFolders")!).folders.find((folder: any) => folder.name === folderName);
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
    this.isLoading = true;
    let previewsFoldersFound = this._findPreviewFolders(this.streetPhotosFolder.childs);

    const promises = previewsFoldersFound.map((preview) => firstValueFrom(this.googleDriveService.getImages(preview.id)));

    try {
      const results = await Promise.all(promises);
      results.forEach((res) => {
        if (res && res.files) {
          res.files = this._adjustThumbnail(res.files, 800);
          this.previewImages.push(...res.files);
        }
      });
      sessionStorage.setItem("googleDrivePreviewImages", JSON.stringify(this.previewImages));
    } catch (err) {
      console.error("Error al obtener las imágenes de vista previa:", err);
    }
    this.isLoading = false;
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

  private _adjustThumbnail(images: any[], resolution = 800) {
    return images.map((image) => {
      return {
        ...image,
        thumbnailLink:
          environment.urlBaseServer + "/proxy-drive" + image.thumbnailLink.split("/drive-storage")[1].replace(/=s\d+/, `=s${resolution}`),
      };
    });
  }

  // Función que se llama cuando una imagen falla
  onImageError(event: Event, folder: any) {
    const imgElement = event.target as HTMLImageElement;
    imgElement.src = this.IMAGE_NO_PREVIEW;

    folder.thumbnailLink = this.IMAGE_NO_PREVIEW;
  }

  viewFolder(folder: any) {
    this.router.navigate(["street-photography", folder.id], { state: folder });
    window.scrollTo({ top: 0 });
  }
}
