import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { SampleAPIService } from './sample-api.service';

describe('SampleAPIService', () => {
  let service: SampleAPIService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(SampleAPIService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
