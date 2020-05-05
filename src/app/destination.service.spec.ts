import { TestBed } from '@angular/core/testing';

import { Destination } from './destination.service';

describe('DestinationService', () => {
  let service: Destination;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Destination);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
