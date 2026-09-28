import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeveloperWorld } from './developer-world';

describe('DeveloperWorld', () => {
  let component: DeveloperWorld;
  let fixture: ComponentFixture<DeveloperWorld>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeveloperWorld]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeveloperWorld);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
