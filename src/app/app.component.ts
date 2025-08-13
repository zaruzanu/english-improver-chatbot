import { Component } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent {
  inputText: string = '';
  suggestions: string[] = [];

  constructor(private http: HttpClient) {}

  checkGrammar() {
    const body = new URLSearchParams();
    body.set('text', this.inputText);
    body.set('language', 'en-US');

    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'
    });

    this.http.post<any>('https://api.languagetoolplus.com/v2/check', body.toString(), { headers })
      .subscribe((response) => {
        this.suggestions = response.matches.map((match: any) =>
          match.replacements.length > 0 ? match.replacements[0].value : 'No suggestion'
        );
      });
  }
}
