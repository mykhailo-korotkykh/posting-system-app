import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AddIssueComponent } from './add-issue.component';
import { DataService } from 'src/app/services/data.service';
import { Issue } from 'src/app/models/issue.model';
import { of } from 'rxjs';

describe('AddIssueComponent', () => {
  let component: AddIssueComponent;
  let fixture: ComponentFixture<AddIssueComponent>;
  let dataServiceStub: Partial<DataService>;

  beforeEach(async () => {
    dataServiceStub = {
      addIssue: jasmine.createSpy('addIssue'),
      saveTagsToLocalStorage: jasmine.createSpy('saveTagsToLocalStorage'),
    };

    await TestBed.configureTestingModule({
      declarations: [AddIssueComponent],
      imports: [ReactiveFormsModule, FormsModule],
      providers: [{ provide: DataService, useValue: dataServiceStub }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddIssueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should add new issue', () => {
    component.issueForm.setValue({
      title: 'Test Issue',
      text: 'This is a test issue.',
      tags: 'tag1,tag2',
    });

    expect(component.issueForm.valid).toBeTrue();
    component.addNewIssue();

    expect(dataServiceStub.addIssue).toHaveBeenCalled();
    expect(dataServiceStub.saveTagsToLocalStorage).toHaveBeenCalledWith(
      jasmine.arrayContaining([
        jasmine.objectContaining({
          title: 'Test Issue',
          text: 'This is a test issue.',
          tags: ['tag1','tag2'],
        } as Issue),
      ])
    );

    expect(component.issueForm.value).toEqual({
      title: null,
      text: null,
      tags: null,
    });
  });

  it('should clear fields', () => {
    component.issueForm.setValue({
      title: 'Test Issue',
      text: 'This is a test issue.',
      tags: 'tag1, tag2',
    });
  
    component.clearFields();
  
    expect(component.issueForm.value).toEqual({
      title: null,
      text: null,
      tags: null,
    });
  });

});
