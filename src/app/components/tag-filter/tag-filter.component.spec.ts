import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TagFilterComponent } from './tag-filter.component';
import { DataService } from 'src/app/services/data.service';
import { of } from 'rxjs';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

describe('TagFilterComponent', () => {
  let component: TagFilterComponent;
  let fixture: ComponentFixture<TagFilterComponent>;
  let dataServiceStub: Partial<DataService>;

  beforeEach(async () => {
    dataServiceStub = {
      getTags: jasmine.createSpy('getTags').and.returnValue(of(['tag1', 'tag2', 'tag3'])),
    };

    await TestBed.configureTestingModule({
      declarations: [TagFilterComponent],
      imports: [FormsModule],
      providers: [{ provide: DataService, useValue: dataServiceStub }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TagFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch tags on initialization', () => {
    expect(dataServiceStub.getTags).toHaveBeenCalled();
    expect(component.tags).toEqual(['tag1', 'tag2', 'tag3']);
  });

  it('should emit tag search on filter', () => {
    spyOn(component.filterByTag, 'emit');
    component.onFilterByTag('tag1');
    expect(component.tagSearch).toBe('tag1');
    expect(component.filterByTag.emit).toHaveBeenCalledWith('tag1');
  });

  it('should emit tag search on searchTags', () => {
    spyOn(component.filterByTag, 'emit');
    component.tagSearch = '   tag2   ';
    component.searchTags();
    expect(component.tagSearch).toBe('tag2');
    expect(component.filterByTag.emit).toHaveBeenCalledWith('tag2');
  });

  it('should emit empty tag search on clearSearch', () => {
    spyOn(component.filterByTag, 'emit');
    component.tagSearch = 'tag3';
    component.clearSearch();
    expect(component.tagSearch).toBe('');
    expect(component.filterByTag.emit).toHaveBeenCalledWith('');
  });

  it('should unsubscribe on component destroy', () => {
    spyOn(component['_destroyed'], 'next');
    spyOn(component['_destroyed'], 'complete');
    fixture.destroy();
    expect(component['_destroyed'].next).toHaveBeenCalledWith(true);
    expect(component['_destroyed'].complete).toHaveBeenCalled();
  });

  it('should render tags in the template', () => {
    const debugElement: DebugElement = fixture.debugElement;
    const tagElements = debugElement.queryAll(By.css('.tag'));

    expect(tagElements.length).toBe(3);
    expect(tagElements[0].nativeElement.textContent).toContain('tag1');
    expect(tagElements[1].nativeElement.textContent).toContain('tag2');
    expect(tagElements[2].nativeElement.textContent).toContain('tag3');
  });
});
