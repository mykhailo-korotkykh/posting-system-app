import { Component } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { v4 as uuidv4 } from 'uuid';
import { Issue } from 'src/app/models/issue.model';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-add-issue',
  templateUrl: './add-issue.component.html',
  styleUrls: ['./add-issue.component.scss'],
})
export class AddIssueComponent {
  public issueForm: FormGroup = new FormGroup({
    title: new FormControl('', Validators.required),
    text: new FormControl('', Validators.required),
    tags: new FormControl(''),
  });

  constructor(private _dataService: DataService) {}

  public get title(): AbstractControl | null {
    return this.issueForm.get('title') || null;
  }

  public get text(): AbstractControl | null {
    return this.issueForm.get('text') || null;
  }

  public addNewIssue(): void {
    if (this.issueForm.valid) {
      const tagsValue = this.issueForm.get('tags')?.value;
      let tagsArray: string[] = [];

      if (tagsValue) {
        tagsArray = tagsValue
          .split(',')
          .filter((tag: string) => Boolean(tag.trim()));
      }

      const newIssue: Issue = {
        id: uuidv4(),
        editable: false,
        title: this.title?.value,
        text: this.text?.value,
        tags: tagsArray,
      };
      this._dataService.addIssue(newIssue);
      this._dataService.saveTagsToLocalStorage([newIssue]);
      this.clearFields();
    }
  }

  public clearFields(): void {
    this.issueForm.reset();
  }
}
