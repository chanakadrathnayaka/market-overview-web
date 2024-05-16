import {ComponentFixture, TestBed} from '@angular/core/testing';

import {IntradayChartComponent} from './intraday-chart.component';

describe('IntradayChartComponent', () => {
  let component: IntradayChartComponent;
  let fixture: ComponentFixture<IntradayChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IntradayChartComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IntradayChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
