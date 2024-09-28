import { ComponentFixture, TestBed } from "@angular/core/testing";

import { StreetPhotographyComponent } from "./street-photography.component";

describe("PhotosessionsComponent", () => {
  let component: StreetPhotographyComponent;
  let fixture: ComponentFixture<StreetPhotographyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StreetPhotographyComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(StreetPhotographyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
