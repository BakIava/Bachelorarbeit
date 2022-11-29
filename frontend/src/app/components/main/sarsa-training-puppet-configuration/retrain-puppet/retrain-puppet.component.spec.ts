import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RetrainPuppetComponent } from './retrain-puppet.component';

describe('RetrainPuppetComponent', () => {
  let component: RetrainPuppetComponent;
  let fixture: ComponentFixture<RetrainPuppetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RetrainPuppetComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RetrainPuppetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
