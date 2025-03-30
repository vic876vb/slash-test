/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing'
import { By } from '@angular/platform-browser'
import { DebugElement } from '@angular/core'

import { ConcurrencyComponent } from './concurrency.component'
import { MAX_CONCURRENCY } from './concurrency.constants'
import { HttpClient } from '@angular/common/http'
import { HttpClientTestingModule } from '@angular/common/http/testing'
import { of } from 'rxjs'

describe('ConcurrencyComponent', () => {
  let component: ConcurrencyComponent
  let fixture: ComponentFixture<ConcurrencyComponent>
  let httpClientSpy: jasmine.SpyObj<HttpClient>


  beforeEach(async(() => {
    let httpClientSpyObj = jasmine.createSpyObj('HttpClient', ['get'])

    TestBed.configureTestingModule({
      declarations: [ConcurrencyComponent],
      imports: [HttpClientTestingModule],
      providers: [{ provide: HttpClient, useValue: httpClientSpyObj }]
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(ConcurrencyComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })

  it('should fetch only few requests at a time', () => {
    // expect(component).toBeTruthy()
  })

  // it('should queue requests', () => {
  //   const urls = ['url1', 'url2', 'url3', 'url4', 'url5']
  //   const { activeRequests } = component

  //   // fetch()
  //   expect(activeRequests.length).toBeLessThanOrEqual(MAX_CONCURRENCY)
  // })
})
