import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';
import { HomeComponent } from './home/home.component';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { FeedbackComponent } from './feedback/feedback.component';
import { ChatinterfaceComponent } from './chatinterface/chatinterface.component';
import { AccentImproverComponent } from './accent-improver/accent-improver.component';
import { PublicSpeakingComponent } from './publicspeaking/publicspeaking.component';
import { HttpClientModule } from '@angular/common/http';
const routes: Routes = [
  
  
      { path: 'home', component: HomeComponent }, // Child routes
      { path: 'home', component: HomeComponent }, // Child routes
      { path: 'register', component: RegisterComponent },
      { path: 'login', component: LoginComponent },
      { path: 'chatinterface', component: ChatinterfaceComponent },
      { path: 'feedback', component: FeedbackComponent },
     { path: 'accent-improver', component: AccentImproverComponent },
      { path: 'publicspeaking', component: PublicSpeakingComponent },
      { path: '', redirectTo: 'home', pathMatch: 'full' }, // Default child route
    
  
  { path: '**', redirectTo: '' } // Redirect invalid paths to Layout
];

@NgModule({
  imports: [RouterModule.forRoot(routes),HttpClientModule],
  exports: [RouterModule]
})
export class AppRoutingModule {}

