import { TestBed } from '@angular/core/testing';
import { DataService } from './data.service';
import { BehaviorSubject } from 'rxjs';
import { Issue } from '../models/issue.model';

describe('DataService', () => {
  let service: DataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should add an issue', () => {
    const issue: Issue = { id: "1", title: 'Test Issue', text: 'Testing', tags: ['tag1'], editable: false };
    service.addIssue(issue);
    service.getIssues().subscribe(issues => {
      expect(issues[0]).toEqual(issue);
    });
  });

  it('should update an issue', () => {
    const initialIssue: Issue = { id: "1", title: 'Test Issue', text: 'Testing', tags: [], editable: false };
    const updatedIssue: Issue = { id: "1", title: 'Test Issue', text: 'Testing', tags: ['tag1'], editable: false };

    service.addIssue(initialIssue);
    service.updateIssue(updatedIssue);

    service.getIssues().subscribe(issues => {
      expect(issues[0]).toEqual(updatedIssue);
    });
  });

  it('should update tags', () => {
    const tags: string[] = ['tag1', 'tag2', 'tag3'];
    service.updateTags(tags);

    service.getTags().subscribe(updatedTags => {
      expect(updatedTags).toEqual(tags);
    });
  });
});
