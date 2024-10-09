import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "../../../environments/environment";

@Injectable({
  providedIn: "root",
})
export class GoogleDriveService {
  private urlBase = environment.urlBaseServer;

  constructor(private http: HttpClient) {}

  listFolders(): Observable<any> {
    return this.http.get(this.urlBase + "/list-folders");
  }

  getImages(folderID: string, pageToken?: string): Observable<any> {
    return this.http.get(this.urlBase + `/${folderID}/files`, {
      params: pageToken ? { pageToken } : {},
    });
  }
}
