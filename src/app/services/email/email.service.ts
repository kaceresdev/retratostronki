import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "../../../environments/environment";

@Injectable({
  providedIn: "root",
})
export class EmailService {
  private emailUrl = environment.urlBaseServer + "/send-email";

  constructor(private http: HttpClient) {}

  sendEmail(email: string, subject: string, message: string, imgContact: string): Observable<any> {
    const data = {
      email: email,
      subject: subject,
      message: message,
      imgContact: imgContact,
    };
    return this.http.post(this.emailUrl, data, { responseType: "text" });
  }
}
