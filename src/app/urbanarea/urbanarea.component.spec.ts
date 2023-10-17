import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UrbanareaComponent } from './urbanarea.component';

describe('UrbanareaComponent', () => {
  let component: UrbanareaComponent;
  let fixture: ComponentFixture<UrbanareaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UrbanareaComponent]
    });
    fixture = TestBed.createComponent(UrbanareaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
