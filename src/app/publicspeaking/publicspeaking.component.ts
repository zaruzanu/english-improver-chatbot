import { Component, AfterViewInit, ChangeDetectorRef, OnInit } from '@angular/core';
import { Router } from '@angular/router';
declare const tsParticles: any;
import { PublicSpeakingService } from '../services/publicspeaking.services';

@Component({
  selector: 'app-public-speaking',
  templateUrl: './publicspeaking.component.html',
  styleUrls: ['./publicspeaking.component.css']
})
export class PublicSpeakingComponent implements AfterViewInit, OnInit {
  email = '';
  selectedTone = 'formal';
  isRecording = false;
  loading = false;
  transcript = '';
  feedback = '';
  audioUrl = '';

  mediaRecorder: any;
  recordedChunks: BlobPart[] = [];

  messages: { type: string, text: string, audio?: string }[] = [];

  constructor(
    private publicSpeakingService: PublicSpeakingService,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) {}

 ngOnInit(): void {
  const storedEmail = localStorage.getItem('email');
  if (storedEmail) {
    this.email = storedEmail;
  }
}

  ngAfterViewInit() {
    tsParticles.load("tsparticles", {
      background: { color: { value: "#00000000" } },
      particles: {
        number: { value: 35 },
        size: { value: 2.5 },
        color: { value: "#00ffff" },
        move: { speed: 0.5 },
        opacity: { value: 0.3 },
        links: { enable: true, color: "#00ffee" }
      }
    });
  }

  toggleRecording() {
    if (this.isRecording) {
      this.mediaRecorder?.stop();
      this.isRecording = false;
      console.log('⏹️ Recording stopped.');
    } else {
      navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
        this.recordedChunks = [];
        this.mediaRecorder = new MediaRecorder(stream);
        this.isRecording = true;
        console.log('🎙️ Recording started.');

        this.mediaRecorder.ondataavailable = (e: any) => {
          if (e.data.size > 0) this.recordedChunks.push(e.data);
        };

        this.mediaRecorder.onstop = () => {
          const blob = new Blob(this.recordedChunks, { type: 'audio/webm' });
          console.log('🎧 Recorded Blob:', blob);
          this.sendAudio(blob);
        };

        this.mediaRecorder.start();
      }).catch(err => {
        console.error('🎤 Microphone access error:', err);
        alert('❌ Microphone access denied or not available.');
        this.isRecording = false;
      });
    }
  }

  sendAudio(audioBlob: Blob) {
    console.log('📤 Sending audio to backend...');
    this.loading = true;

    this.publicSpeakingService.sendAudio(audioBlob, this.email, this.selectedTone).subscribe({
      next: (res) => {
        console.log('✅ API Response:', res);

        this.transcript = res.transcription;
        this.feedback = res.professionalVersion;
        this.audioUrl = res.aiAudioUrl;

        this.messages.push({
          type: 'user',
          text: this.transcript,
          audio: res.userAudioUrl
        });

        this.messages.push({
          type: 'bot',
          text: `🧠 ${this.selectedTone.toUpperCase()} Version: ${this.feedback}`,
          audio: res.aiAudioUrl
        });

        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('❌ API Error:', err);
        this.feedback = '❌ Error processing audio.';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }
}
