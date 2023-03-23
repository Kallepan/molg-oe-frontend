import { TestBed } from '@angular/core/testing';

import { SampleAPIService } from './sample-api.service';

describe('SampleAPIService', () => {
  let service: SampleAPIService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SampleAPIService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
