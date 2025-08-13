import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PublicSpeakingService {
  constructor(private http: HttpClient) {}

  sendAudio(blob: Blob, email: string, tone: string) {
  const formData = new FormData();
  formData.append('audio', blob, 'input.webm');
  formData.append('email', email);
  formData.append('tone', tone); // 🟡 New tone field

  return this.http.post<any>('http://localhost:5000/api/publicspeaking/public-speaking', formData);
}

}
