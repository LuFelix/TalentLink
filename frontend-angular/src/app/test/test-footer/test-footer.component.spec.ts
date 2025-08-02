import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestFooterComponent } from './test-footer.component';

describe('TestFooterComponent', () => {
  let component: TestFooterComponent;
  let fixture: ComponentFixture<TestFooterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestFooterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TestFooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
