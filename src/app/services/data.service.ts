import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, take } from 'rxjs';
import { Issue } from '../models/issue.model';


@Injectable({
  providedIn: 'root'
})
export class DataService {
  private _issueStorageKey: string = 'issues';
  private _tagsStorageKey: string = 'tags';
  private _issuesSubject: BehaviorSubject<Issue[]> = new BehaviorSubject<Issue[]>([]);
  private _tagsSubject: BehaviorSubject<string[]> = new BehaviorSubject<string[]>([]);

  constructor() {
    this._loadIssuesFromLocalStorage();
    this._loadTagsFromTheLocalStorage();
  }

  public saveIssuesToLocalStorage(issues: Issue[]): void {
    localStorage.setItem(this._issueStorageKey, JSON.stringify(issues));
  }

  public saveTagsToLocalStorage(issues: Issue[]): void {
    this.getTags().pipe(take(1)).subscribe((existingTags: string[]) => {
      const currentIssueTags: string[] = issues.flatMap((issue: Issue) => issue.tags).map((tag: string) => tag.trim());
      const uniqueUserTags: string[] = [...new Set([...existingTags, ...currentIssueTags])];
      localStorage.setItem(this._tagsStorageKey, JSON.stringify(uniqueUserTags));
      this._tagsSubject.next(uniqueUserTags);
    })
  }

  public getIssues(): Observable<Issue[]> {
    return this._issuesSubject.asObservable();
  }

  public getTags(): Observable<string[]> {
    return this._tagsSubject.asObservable();
  }

  public addIssue(issue: Issue): void {
    const currentIssues = this._issuesSubject.getValue();
    const updatedIssues = [...currentIssues, issue];
    this._manageIssues(updatedIssues);
  }

  public updateIssue(updatedIssue: Issue): void {
    const currentIssues = this._issuesSubject.getValue();
    const index = currentIssues.findIndex((issue: Issue) => issue.id === updatedIssue.id);
    if (index !== -1) {
      currentIssues[index] = updatedIssue;
      this._manageIssues(currentIssues);
    }
  }

  public updateTags(tags: string[]): void {
    localStorage.setItem(this._tagsStorageKey, JSON.stringify(tags));
    this._tagsSubject.next(tags);
  }

  private _loadIssuesFromLocalStorage(): void {
    const storedData = localStorage.getItem(this._issueStorageKey);
    if (storedData) {
      const parsedData: Issue[] = JSON.parse(storedData);
      this._issuesSubject.next(parsedData);
    }
  }

  private _loadTagsFromTheLocalStorage(): void {
    const storedData = localStorage.getItem(this._tagsStorageKey);
    if (storedData) {
      const parsedData: string[] = JSON.parse(storedData);
      this._tagsSubject.next(parsedData);
    }
  }

  private _manageIssues(issues: Issue[]): void {
    this._issuesSubject.next(issues);
    this.saveIssuesToLocalStorage(issues);
  }
}