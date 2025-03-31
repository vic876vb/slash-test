import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing'
import { ConcurrencyComponent } from './concurrency.component'
import { HttpClient } from '@angular/common/http'
import { delay, finalize, of } from 'rxjs'
import { AppTestingModule } from '../../testing/app-testing.module'

describe('ConcurrencyComponent', () => {
  let component: ConcurrencyComponent
  let fixture: ComponentFixture<ConcurrencyComponent>
  let httpClientSpy: jasmine.SpyObj<HttpClient>

  beforeEach(async () => {
    httpClientSpy = jasmine.createSpyObj('HttpClient', ['get'])

    TestBed.configureTestingModule({
      imports: [AppTestingModule, ConcurrencyComponent],
      providers: [{ provide: HttpClient, useValue: httpClientSpy }]
    }).compileComponents()
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(ConcurrencyComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })

  it('should fetch only few requests at a time', fakeAsync(() => {
    const urls = ['url1', 'url2', 'url3', 'url4', 'url5']
    const maxConcurrency = 2
    let activeRequests = 0
    let maxConcurrent = 0

    httpClientSpy.get.and.callFake(() => {
      activeRequests++
      maxConcurrent = Math.max(activeRequests, maxConcurrent)

      return of().pipe(
        delay(100),
        finalize(() => activeRequests--)
      )
    })

    component.fetchUrls(urls, maxConcurrency).subscribe()
    tick()

    expect(maxConcurrent).toBeLessThanOrEqual(maxConcurrency)
  }))
})
