import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ChatService {
  private baseUrl = 'http://localhost:5000/api/chat';

  constructor(private http: HttpClient) {}

  // ✅ POST /api/chat/chat
  sendMessage(email: string, message: string): Observable<{ botReply: string }> {
    return this.http.post<{ botReply: string }>(`${this.baseUrl}/chat`, { email, message });
  }

  // ✅ GET /api/chat/history/:email
  getChatHistory(email: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/history/${email}`);
  }

  sendAudioForPronunciation(audioBlob: Blob): Observable<any> {
    const formData = new FormData();
    formData.append('audio', audioBlob, 'speech.wav');
    return this.http.post<any>('http://localhost:5000/api/accent/analyze-pronunciation', formData);
  }
}
