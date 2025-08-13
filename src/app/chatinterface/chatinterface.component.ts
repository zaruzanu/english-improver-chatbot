import { Component, AfterViewInit, ViewChild, ElementRef, OnInit } from '@angular/core';
import { ChatService } from '../services/chat.services';
import { Router } from '@angular/router';

@Component({
  selector: 'app-chatinterface',
  templateUrl: './chatinterface.component.html',
  styleUrls: ['./chatinterface.component.css']
})
export class ChatinterfaceComponent implements AfterViewInit, OnInit {

  @ViewChild('chatMessages') chatMessagesRef!: ElementRef;
  @ViewChild('voiceBtn') voiceBtnRef!: ElementRef;

  userEmail: string = '';
  inputText: string = '';
  isLoading: boolean = false; // ⬅️ added

  constructor(private chatService: ChatService, private router: Router) {}

  ngOnInit(): void {
    const storedEmail = localStorage.getItem('email');
    if (storedEmail) {
      this.userEmail = storedEmail;
      this.fetchOldChats(this.userEmail);
    } else {
      this.addBotMessage("Hello! I am your English improver assistant.");
    }
  }

  ngAfterViewInit(): void {
    if (this.voiceBtnRef) {
      this.voiceBtnRef.nativeElement.addEventListener('click', () => this.startVoiceRecognition());
    }
  }

  fetchOldChats(email: string) {
    this.chatService.getChatHistory(email).subscribe({
      next: (res: any) => {
        if (res.history && res.history.length > 0) {
          res.history.forEach((chat: any) => {
            this.addUserMessage(chat.userMessage);
            this.addBotMessage(chat.botMessage);
          });
        } else {
          this.addBotMessage("Hello! I am your English improver assistant.");
        }
      },
      error: (err: any) => {
        console.error('Failed to fetch chat history:', err);
        this.addBotMessage("Hello! I am your English improver assistant.");
      }
    });
  }

  handleTextInput(userText: string) {
    if (userText.trim() === '') return;
    this.addUserMessage(userText);
    this.getImprovedReply(userText);
  }

  addUserMessage(text: string) {
    const msg = document.createElement('div');
    msg.className = 'message user-message';
    msg.textContent = text;
    this.chatMessagesRef.nativeElement.appendChild(msg);
    this.scrollToBottom();
  }

  addBotMessage(text: string) {
    const msg = document.createElement('div');
    msg.className = 'message bot-message';
    msg.textContent = text;
    this.chatMessagesRef.nativeElement.appendChild(msg);
    this.scrollToBottom();
  }

  getImprovedReply(userText: string) {
    this.isLoading = true; // ⬅️ spinner start

    this.chatService.sendMessage(this.userEmail, userText).subscribe({
      next: (res: any) => {
        this.isLoading = false; // ⬅️ spinner stop
        if (res?.botReply) {
          this.addBotMessage(res.botReply);
        } else {
          this.addBotMessage("Sorry, I couldn't process your message.");
        }
      },
      error: (err: any) => {
        this.isLoading = false; // ⬅️ spinner stop
        console.error('Error calling backend:', err);
        this.addBotMessage("Sorry, something went wrong with the server.");
      }
    });
  }

  startVoiceRecognition() {
    const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;

    if (!SpeechRecognition) {
      alert("Your browser doesn't support speech recognition.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.start();

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      this.addUserMessage(transcript);
      this.getImprovedReply(transcript);
    };

    recognition.onerror = (event: any) => {
      alert("Error occurred in recognition: " + event.error);
    };
  }

  scrollToBottom() {
    const el = this.chatMessagesRef.nativeElement;
    el.scrollTop = el.scrollHeight;
  }
}
