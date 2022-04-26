import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListeMedicamentsComponent } from './liste-medicaments.component';

describe('ListeMedicamentsComponent', () => {
  let component: ListeMedicamentsComponent;
  let fixture: ComponentFixture<ListeMedicamentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListeMedicamentsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListeMedicamentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
