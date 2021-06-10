import { TestBed } from '@angular/core/testing';
import { AuthGaurdService } from './auth-gaurd-service';

describe('AuthGaurdServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AuthGaurdService = TestBed.get(AuthGaurdService);
    expect(service).toBeTruthy();
  });
});
