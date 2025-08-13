import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { LayoutComponent } from './layout/layout.component';
import { FeedbackComponent } from './feedback/feedback.component';
import { ChatinterfaceComponent } from './chatinterface/chatinterface.component';
import { AccentImproverComponent } from './accent-improver/accent-improver.component';
import { PublicSpeakingComponent } from './publicspeaking/publicspeaking.component';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    RegisterComponent,
    LayoutComponent,
    FeedbackComponent,
    ChatinterfaceComponent,
    AccentImproverComponent,
    PublicSpeakingComponent
  ],
  imports: [
    CommonModule,
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }





