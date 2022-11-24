import { HttpClient } from '@angular/common/http';
import { Injectable, NgZone } from '@angular/core';
import { firstValueFrom, map, Observable } from 'rxjs';
import { IStreamdata } from 'src/app/model/IStreamdata';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private endpoint: string = 'http://localhost:3000'

  constructor(private http: HttpClient) { }

  async start(config: any) {
    return firstValueFrom(this.http.post<any>(`${this.endpoint}/start`, { config }));
  }

  async getExample() {
    return firstValueFrom(this.http.get<any>('assets/example-q.json'));
  }
}
