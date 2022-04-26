import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListeRapportsComponent } from './liste-rapports.component';

describe('ListeRapportsComponent', () => {
  let component: ListeRapportsComponent;
  let fixture: ComponentFixture<ListeRapportsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListeRapportsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListeRapportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
