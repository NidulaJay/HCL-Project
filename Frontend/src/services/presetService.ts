import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { Preset } from '../models/preset.model';

@Injectable({
  providedIn: 'root',
})
export class PresetService {
  private apiUrl = 'http://localhost:3001/api/preset';

  constructor(private http: HttpClient) {}

  getDesigns(userId: string): Observable<Preset[]> {
    return this.http.get<any[]>(`${this.apiUrl}/user/${userId}`).pipe(
      map((response) => {
        if (response) {
          const models: Preset[] = [];
          response.forEach(preset => {
            const model = this.mapToModel(preset);
            models.push(model);
          });
          return models;
        } else {
          throw new Error('No response data');
        }
      })
    );
  }

  getDesign(presetId: string): Observable<Preset>{
    return this.http.get<any>(`${this.apiUrl}/${presetId}`).pipe(
        map((response) => {
            if(response){
                const preset = this.mapToModel(response);
                return preset;
            } else{
                throw new Error('No Response Data')
            }
        })
    );
  }

  createDesign(userId: string, data: any): Observable<Preset | false>{
    return this.http.post<any>(`${this.apiUrl}/${userId}`, data).pipe(
        map((response) => {
            console.log(response)
            if(response){
                let preset = this.mapToModel(response);
                return preset
            } else {
                return false;
            }
        }

        )
    )
  }

  deleteDesign(presetId: string): Observable<boolean>{
    return this.http.delete<any>(`${this.apiUrl}/${presetId}`).pipe(
        map((response) => {
            return response;
        })
    )
  }

  updateDesign(presetId: string, data: any): Observable<Preset | false>{
    return this.http.put<any>(`${this.apiUrl}/${presetId}`, data, { observe: 'response' }).pipe(
        map((response) => {
            if(response.status == 200){
                return this.mapToModel(response.body)
            }
            else{
                console.log(response)
                return false;
            }
        }
    )
    )
  }

  mapToModel(data: any): Preset {
    return {
      id: data.id,
      name: data.name,
      color: data.color,
      model: data.model,
      size: data.size
    };
  }
}
