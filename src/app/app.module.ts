import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { IssueListComponent } from './components/issue-list/issue-list.component';
import { TagFilterComponent } from './components/tag-filter/tag-filter.component';
import { FormsModule } from '@angular/forms';
import { AddIssueComponent } from './components/add-issue/add-issue.component';
import { DataService } from './services/data.service';
import { ConfirmationModalComponent } from './components/shared/confirmation-modal/confirmation-modal.component';

@NgModule({
  declarations: [
    AppComponent,
    IssueListComponent,
    TagFilterComponent,
    AddIssueComponent,
    ConfirmationModalComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [DataService],
  bootstrap: [AppComponent]
})
export class AppModule { }
