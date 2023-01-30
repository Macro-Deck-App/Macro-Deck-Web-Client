import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AngularResizeEventModule } from 'angular-resize-event';

import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { WidgetsGridComponent } from './components/widgets-grid/widgets-grid.component';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { WidgetActionbuttonComponent } from './components/widget-actionbutton/widget-actionbutton.component';
import { ToolbarComponent } from './components/toolbar/toolbar.component';
import {TouchEventModule} from "ng2-events/lib/touch";
import { MainComponent } from './components/main/main.component';
import { MatCardModule } from '@angular/material/card';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatDividerModule } from '@angular/material/divider';
import { ConnectComponent } from './components/connect/connect.component';
import {MatDialogModule} from '@angular/material/dialog';
import { AddConnectionDialogComponent } from './components/add-connection-dialog/add-connection-dialog.component';
import {MatInputModule} from '@angular/material/input';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatRippleModule} from '@angular/material/core';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';

@NgModule({
  declarations: [
    AppComponent,
    WidgetsGridComponent,
    WidgetActionbuttonComponent,
    ToolbarComponent,
    MainComponent,
    ConnectComponent,
    AddConnectionDialogComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatSlideToggleModule,
    MatGridListModule,
    MatToolbarModule,
    MatMenuModule,
    MatIconModule,
    MatButtonModule,
    AngularResizeEventModule,
    TouchEventModule,
    MatCardModule,
    MatProgressBarModule,
    MatDividerModule,
    MatDialogModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    MatRippleModule,
    MatProgressSpinnerModule
  ],
  exports: [
    TouchEventModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
