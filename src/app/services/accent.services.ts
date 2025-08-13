import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AccentService {

  private API_URL = 'http://localhost:5000/api/accent-improver/improve-accent';

  constructor(private http: HttpClient) {}

  sendAudio(audioBlob: Blob, email: string, accent: string): Observable<any> {
    const formData = new FormData();

    // ⏺️ Append audio blob with filename
    formData.append('audio', audioBlob, 'recording.webm');

    // 📧 Append email & accent type
    formData.append('email', email);
    formData.append('accent', accent);

    // 📡 Send POST request
    return this.http.post<any>(this.API_URL, formData);
  }
}
