import { Component, ChangeDetectorRef, OnInit } from '@angular/core';
import { AccentService } from '../services/accent.services';
import { Router } from '@angular/router';

@Component({
  selector: 'app-accent-improver',
  templateUrl: './accent-improver.component.html',
  styleUrls: ['./accent-improver.component.css']
})
export class AccentImproverComponent implements OnInit {
  email = '';
  isRecording = false;
  selectedAccent = 'us';
  loading = false;
  transcript = '';
  correctedVersion = '';
  userAudioUrl = '';
  aiAudioUrl = '';
  feedback = '';
  audioVersion = 0;
  mediaRecorder: any;
  recordedChunks: BlobPart[] = [];
  messages: { type: string, text: string, audio?: string }[] = [];

  accents = [
    { label: 'US', value: 'us' },
    { label: 'UK', value: 'uk' },
    { label: 'India', value: 'india' },
    { label: 'Pakistan', value: 'pakistan' },
    { label: 'Germany', value: 'german' },
    { label: 'Chinese', value: 'chinese' },
    { label: 'Australian', value: 'australian' }
  ];

  constructor(
    private accentService: AccentService,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) {}

  ngOnInit(): void {
    const storedEmail = localStorage.getItem('email');
    if (storedEmail) {
      this.email = storedEmail;
    }
  }

  toggleRecording() {
    if (this.isRecording) {
      this.mediaRecorder?.stop();
      this.isRecording = false;
      console.log('⏹️ Recording stopped manually.');
    } else {
      console.log('🎙️ Attempting to access microphone...');
      navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
        this.recordedChunks = [];
        this.mediaRecorder = new MediaRecorder(stream);
        this.isRecording = true;
        console.log('🎙️ Microphone stream started. Recording...');

        this.mediaRecorder.ondataavailable = (e: any) => {
          if (e.data.size > 0) {
            this.recordedChunks.push(e.data);
            console.log('📥 Audio chunk received:', e.data);
          }
        };

        this.mediaRecorder.onstop = () => {
          const blob = new Blob(this.recordedChunks, { type: 'audio/webm' });
          console.log('🎧 Recording complete. Blob ready:', blob);
          this.sendAudio(blob);
        };

        this.mediaRecorder.start();
        console.log('▶️ MediaRecorder started...');
      }).catch(err => {
        console.error('❌ Microphone access error:', err);
        alert('❌ Microphone access denied or not available.');
        this.isRecording = false;
      });
    }
  }

  sendAudio(audioBlob: Blob) {
    console.log('📤 Sending audio to backend...');
    console.log('📧 Email:', this.email);
    console.log('🗣️ Selected Accent:', this.selectedAccent);
    this.loading = true;

    this.accentService.sendAudio(audioBlob, this.email, this.selectedAccent).subscribe({
      next: (res) => {
        console.log('✅ Response received from server:', res);

        this.userAudioUrl = '';
        this.aiAudioUrl = '';
        this.messages = [];

        setTimeout(() => {
          this.userAudioUrl = res.userAudioUrl;
          this.transcript = res.transcribedText;
          this.correctedVersion = res.correctedText;
          this.aiAudioUrl = res.audioUrl;
          this.audioVersion = Date.now();
          this.feedback = res.pronunciationFeedback?.tips || 'No tips';

          this.messages.push({
            type: 'user',
            text: this.transcript,
            audio: this.userAudioUrl
          });

          this.messages.push({
            type: 'bot',
            text: `🧠 Accent Rephrased: ${this.correctedVersion}`,
            audio: this.aiAudioUrl
          });

          this.messages.push({
            type: 'bot',
            text: `💡 Suggestion: ${this.feedback}`
          });

          this.cdr.detectChanges();

          // 🔊 Sequential audio playback
          this.playSequentially(this.userAudioUrl, this.aiAudioUrl);

        }, 50);

        this.loading = false;
      },
      error: (err) => {
        console.error('❌ API request failed:', err);
        this.messages.push({ type: 'bot', text: '❌ Error: Unable to process your voice. Please try again.' });
        this.loading = false;
      }
    });
  }

  // 🎯 New Function for Sequential Playback
  playSequentially(userAudioUrl: string, aiAudioUrl: string) {
    if (!userAudioUrl || !aiAudioUrl) return;

    const userAudio = new Audio(userAudioUrl);
    const aiAudio = new Audio(aiAudioUrl);

    // Pehle user audio chale, phir AI audio
    userAudio.onended = () => {
      aiAudio.play().catch(err => console.error("AI audio play error:", err));
    };

    userAudio.play().catch(err => console.error("User audio play error:", err));
  }

  
}
