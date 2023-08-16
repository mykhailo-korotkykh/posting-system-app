import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { IssueListComponent } from './components/issue-list/issue-list.component';
import { AddIssueComponent } from './components/add-issue/add-issue.component';
import { TagFilterComponent } from './components/tag-filter/tag-filter.component';

describe('AppComponent', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      declarations: [
        AppComponent,
        IssueListComponent,
        AddIssueComponent,
        TagFilterComponent,
      ],
    })
  );

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });
});
