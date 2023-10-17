import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuildingcategoryComponent } from './buildingcategory.component';

describe('BuildingcategoryComponent', () => {
  let component: BuildingcategoryComponent;
  let fixture: ComponentFixture<BuildingcategoryComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BuildingcategoryComponent]
    });
    fixture = TestBed.createComponent(BuildingcategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
