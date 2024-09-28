import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrivateSessionsComponent } from './private-sessions.component';

describe('PrivateSessionsComponent', () => {
  let component: PrivateSessionsComponent;
  let fixture: ComponentFixture<PrivateSessionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PrivateSessionsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PrivateSessionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
