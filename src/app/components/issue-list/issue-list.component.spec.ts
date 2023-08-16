import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IssueListComponent } from './issue-list.component';
import { DataService } from 'src/app/services/data.service';
import { of } from 'rxjs';
import { Issue } from 'src/app/models/issue.model';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('IssueListComponent', () => {
  let component: IssueListComponent;
  let fixture: ComponentFixture<IssueListComponent>;
  let dataServiceSpy: jasmine.SpyObj<DataService>;

  beforeEach(() => {
    const spy = jasmine.createSpyObj('DataService', ['getIssues', 'getTags', 'updateIssue', 'saveTagsToLocalStorage']);

    TestBed.configureTestingModule({
      declarations: [IssueListComponent],
      providers: [{ provide: DataService, useValue: spy }],
      schemas: [NO_ERRORS_SCHEMA],
    });

    fixture = TestBed.createComponent(IssueListComponent);
    component = fixture.componentInstance;
    dataServiceSpy = TestBed.inject(DataService) as jasmine.SpyObj<DataService>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch issues and tags on ngOnInit', () => {
    const mockIssues: Issue[] = [{ id: "1", text: "test text", title: 'Test Issue', tags: ['tag1'], editable: false }];
    const mockTags: string[] = ['tag1', 'tag2'];

    dataServiceSpy.getIssues.and.returnValue(of(mockIssues));
    dataServiceSpy.getTags.and.returnValue(of(mockTags));

    component.ngOnInit();

    expect(dataServiceSpy.getIssues).toHaveBeenCalled();
    expect(dataServiceSpy.getTags).toHaveBeenCalled();

    expect(component.issues).toEqual(mockIssues);
    expect(component.tags).toEqual(mockTags);
  });

  it('should filter issues by tag', () => {
    const mockIssues: Issue[] = [
      { id: "1", title: 'Issue 1', text: "test text", tags: ['tag1'], editable: false  },
      { id: "2", title: 'Issue 2', text: "test text", tags: ['tag2'], editable: false },
    ];
    const selectedTag = 'tag1';

    dataServiceSpy.getIssues.and.returnValue(of(mockIssues));
    
    component.onFilterByTag(selectedTag);
    
    expect(component.issues.length).toBe(1);
    expect(component.issues[0].title).toBe('Issue 1');
  });

  it('should toggle edit mode', () => {
    const mockIssue: Issue = { id: "1", text: "test text", title: 'Test Issue', tags: ['tag1'], editable: false };
    
    component.issues = [mockIssue];
    component.toggleEditMode(0);
    
    expect(mockIssue.editable).toBe(true);
    
    component.toggleEditMode(0);
    expect(mockIssue.editable).toBe(false);
  });

  it('should update issue tags', () => {
    const mockIssue: Issue = { id: "1", text: "test text", title: 'Test Issue', tags: ['tag1'], editable: true };
    component.issues = [mockIssue];
    
    component.tagsString = 'tag1,tag2';
    component.toggleEditMode(0);

    expect(mockIssue.tags).toEqual(['tag1','tag2']);
  });
});