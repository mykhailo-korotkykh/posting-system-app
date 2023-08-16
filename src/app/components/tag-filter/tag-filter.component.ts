import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Subject } from 'rxjs/internal/Subject';
import { takeUntil } from 'rxjs/internal/operators/takeUntil';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-tag-filter',
  templateUrl: './tag-filter.component.html',
  styleUrls: ['./tag-filter.component.scss']
})
export class TagFilterComponent implements OnInit, OnDestroy {
  @Output() public filterByTag = new EventEmitter<string>();
  public tagSearch = '';
  private _destroyed = new Subject();
  public tags: string[] = []; 

  constructor(private _dataService: DataService) { }

  public ngOnInit(): void {
    this._dataService.getTags()
    .pipe(
      takeUntil(this._destroyed),
    ).subscribe((tags) => {
      this.tags = tags;
    });
  }

  public ngOnDestroy() {
    this._destroyed.next(true);
    this._destroyed.complete();
  }

  public onFilterByTag(tag: string): void {
    this.tagSearch = tag;
    this.filterByTag.emit(this.tagSearch)
  }

  public searchTags(): void {
    this.tagSearch = this.tagSearch?.trim();
    this.filterByTag.emit(this.tagSearch)
  }

  public clearSearch(): void {
    this.tagSearch = '';
    this.filterByTag.emit(this.tagSearch)
  }
}
