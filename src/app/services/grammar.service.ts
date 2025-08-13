import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GrammarService {
  private apiUrl = 'http://localhost:3000/check-grammar'; // Node.js backend route

  constructor(private http: HttpClient) {}

  // For your own backend (Node.js)
  checkGrammar(text: string): Observable<any> {
    return this.http.post(this.apiUrl, { text });
  }

  // For Azure API directly (optional, use only if you're not using Node backend)
  checkGrammarAzure(text: string): Observable<any> {
    const url = 'https://<your-endpoint>.cognitiveservices.azure.com/language/:analyze-text?api-version=2022-05-01';

    const headers = new HttpHeaders({
      'Ocp-Apim-Subscription-Key': '<your-key>',
      'Content-Type': 'application/json'
    });

    const body = {
      kind: "GrammarCorrection",
      parameters: {
        text: text
      }
    };

    return this.http.post(url, body, { headers });
  }
}
