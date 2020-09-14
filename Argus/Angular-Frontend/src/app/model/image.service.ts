import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {environment} from '../../environments/environment';
// import {environment} from '../../environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class ImageService {
  private baseUrl = `${environment.apiUrl}/api/images`;

  constructor(private http: HttpClient) { }

  getImageById(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/${id}`);
  }

  addImage(image: any): Observable<any> {
    return this.http.post(`${this.baseUrl}`, image);
  }

  updateImage(id: number, value: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/${id}`, value);
  }

  deleteImage(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`, { responseType: 'text' });
  }

  getImageList(): Observable<any> {
    return this.http.get(`${this.baseUrl}`);
  }
}
