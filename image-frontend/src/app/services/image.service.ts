import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ImageService {

  API_URL: String; 

  constructor(private http: HttpClient) {
    this.API_URL = 'http://localhost:8080/';
  }

  public getAllImages() {
    return this.http.get(this.API_URL + 'image');
  }

  public addImage(uploadImageData: any): Observable<any> {
    return this.http.post(this.API_URL + 'image/upload', uploadImageData, { observe: 'response' })
  }

  public deleteImage(imageId: number): Observable<any> {
    return this.http.delete(this.API_URL + 'image/' +imageId);
  }


}
