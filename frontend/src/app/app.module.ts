import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule } from '@angular/material/button';
import { HttpClientModule } from '@angular/common/http';
import { MainComponent } from './components/main/main.component';
import { MatSelectModule } from '@angular/material/select';
import { MatStepperModule } from '@angular/material/stepper';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { SarsaConfigurationComponent } from './components/main/sarsa-configuration/sarsa-configuration.component';
import { MatDividerModule } from '@angular/material/divider';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ResultComponent } from './components/main/result/result.component';
import { MatCardModule } from '@angular/material/card';
import { MolaRotundaComponent } from './components/main/mola-rotunda/mola-rotunda.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { ToolTipComponent } from './components/main/mola-rotunda/tool-tip/tool-tip.component';
import { ToolTipDirectiveComponent } from './components/main/mola-rotunda/tool-tip/tool-tip-directive/tool-tip-directive.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { VersusComponent } from './components/main/versus/versus.component';
import { MatDialogModule } from '@angular/material/dialog';
import { WinnerComponent } from './components/main/versus/winner/winner.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';


@NgModule({
  declarations: [
    AppComponent,
    MainComponent,
    SarsaConfigurationComponent,
    ResultComponent,
    MolaRotundaComponent,
    ToolTipComponent,
    ToolTipDirectiveComponent,
    VersusComponent,
    WinnerComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatButtonModule,
    HttpClientModule,
    MatSelectModule,
    MatStepperModule,
    FormsModule,
    ReactiveFormsModule,
    MatDividerModule,
    MatInputModule,
    MatCheckboxModule,
    MatToolbarModule,
    MatCardModule,
    MatTooltipModule,
    MatMenuModule,
    MatIconModule,
    MatSnackBarModule,
    MatDialogModule,
    MatProgressSpinnerModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
