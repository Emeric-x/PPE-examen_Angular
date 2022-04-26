import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListeVisiteursComponent } from './liste-visiteurs.component';

describe('ListeVisiteursComponent', () => {
  let component: ListeVisiteursComponent;
  let fixture: ComponentFixture<ListeVisiteursComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListeVisiteursComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListeVisiteursComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
