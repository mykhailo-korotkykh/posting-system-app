import { Component, OnDestroy, OnInit } from '@angular/core';
import { filter, tap, takeUntil } from 'rxjs';
import { Subject } from 'rxjs/internal/Subject';
import { Issue } from 'src/app/models/issue.model';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-issue-list',
  templateUrl: './issue-list.component.html',
  styleUrls: ['./issue-list.component.scss'],
})
export class IssueListComponent implements OnInit, OnDestroy {
  public issues: Issue[] = [];
  public tags: string[] = [];
  public tagsString = '';
  public selectedIssueIndex: number | null = null;
  public isConfirmationModalVisible = false;
  private _destroyed = new Subject();

  constructor(private dataService: DataService) {}

  public ngOnInit(): void {
    this.dataService
      .getIssues()
      .pipe(takeUntil(this._destroyed))
      .subscribe((issues: Issue[]) => {
        this.issues = issues;
      });
    this.dataService
      .getTags()
      .pipe(takeUntil(this._destroyed))
      .subscribe((tags: string[]) => {
        this.tags = tags;
      });
  }

  public ngOnDestroy(): void {
    this._destroyed.next(true);
    this._destroyed.complete();
  }

  public onFilterByTag(selectedTag: string): void {
    this.dataService
      .getIssues()
      .pipe(
        tap((issues: Issue[]) => this.issues = issues),
        filter(() => Boolean(selectedTag)),
        tap(() => {
          this.issues = this.issues.filter((issue: Issue) =>
            issue.tags.some((tag: string) => tag.toLowerCase().includes(selectedTag.toLowerCase()))
        )}),
        takeUntil(this._destroyed)
      ).subscribe();
  }

  public toggleEditMode(index: number): void {
    const issue = this.issues[index];
    issue.editable = !issue.editable;
    
    if (issue.editable) {
      this.tagsString = issue.tags.join(', ');
    } else {
      issue.tags = this.tagsString
          .split(',')
          .filter((tag: string) => Boolean(tag.trim()));

      this.dataService.updateIssue(issue);
      this.dataService.saveTagsToLocalStorage([issue]);
    }   
  }

  public deleteIssue(index: number): void {
    this.selectedIssueIndex = index;
    this.isConfirmationModalVisible = true;
  }

  public onConfirm(): void {
    if (this.selectedIssueIndex != null) {
      this.issues.splice(this.selectedIssueIndex, 1);
      this.dataService.saveIssuesToLocalStorage(this.issues);
      const currentIssueTags = this.issues.flatMap((issue: Issue) => issue.tags);
      const uniqueUserTags = [...new Set(currentIssueTags)];
      this.dataService.updateTags(uniqueUserTags);
    }

    this.onDismiss();
  }

  public onDismiss(): void {
    this.isConfirmationModalVisible = false;
    this.selectedIssueIndex = null;
  }
}
