import { HttpClient } from '@angular/common/http'
import { Component, OnInit } from '@angular/core'
import { BehaviorSubject, catchError, combineLatestWith, concatMap, defer, delay, finalize, from, map, mergeMap, Observable, of, race, share, switchMap, take, tap, toArray } from 'rxjs'
import { ConcurrencyRequest, ConcurrencyResponse } from './concurrency.models'
import { MAX_CONCURRENCY } from './concurrency.constants'
import { CommonModule } from '@angular/common'
import { MatExpansionModule } from '@angular/material/expansion'
import { MatCardModule } from '@angular/material/card'
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy'

@UntilDestroy()
@Component({
  selector: 'app-concurrency',
  standalone: true,
  imports: [CommonModule, MatExpansionModule, MatCardModule],
  templateUrl: './concurrency.component.html',
  styleUrls: ['./concurrency.component.scss'],
})
export class ConcurrencyComponent implements OnInit {
  private activeRequestsSubject: BehaviorSubject<ConcurrencyRequest[]> = new BehaviorSubject([])
  public activeRequests = this.activeRequestsSubject.asObservable().pipe(share())

  private queuedRequestsSubject: BehaviorSubject<ConcurrencyRequest[]> = new BehaviorSubject([])
  public queuedRequests = this.queuedRequestsSubject.asObservable().pipe(share())

  private responsesSubject: BehaviorSubject<ConcurrencyResponse[]> = new BehaviorSubject([])
  public responses = this.responsesSubject.asObservable()

  constructor(private http: HttpClient) { }

  ngOnInit() {
    // const url = 'https://official-joke-api.appspot.com/random_joke'
    const urls = [
      'https://countriesnow.space/api/v0.1/countries/population/cities',
      'https://countriesnow.space/api/v0.1/countries/population',
      'https://countriesnow.space/api/v0.1/countries/positions',
      'https://countriesnow.space/api/v0.1/countries/flag/unicode',
      'https://countriesnow.space/api/v0.1/countries/flag/images',
      'https://countriesnow.space/api/v0.1/countries/currency',
      'https://countriesnow.space/api/v0.1/countries/capital',
      'https://countriesnow.space/api/v0.1/countries',
      'https://countriesnow.space/api/v0.1/countries/iso',
      'https://countriesnow.space/api/v0.1/countries/codes',
      'https://countriesnow.space/api/v0.1/countries/info?returns=currency,flag,unicodeFlag,dialCode',
      'https://countriesnow.space/api/v0.1/countries/states',
    ]

    from(urls)
      .pipe(
        tap((url) => this.addToQueuedRequests(url)),
        mergeMap((url, index) => this.processRequest(url, index), MAX_CONCURRENCY),
        tap((data) => console.log('data', data)),
        untilDestroyed(this)
      )
      .subscribe()
  }

  private processRequest(url: string, index: number) {
    return defer(() => this.http.get(url)).pipe(
      take(1),
      tap(() => {
        this.removeFromQueuedRequests(url)
        this.addToActiveRequests(url)
      }),
      delay(3000), // fake response delay
      catchError((error) => of({ error, message: `Error requesting ${url}` })),
      tap((response) => this.addToResponses(url, response, index)),
      finalize(() => this.removeFromActiveRequests(url)),
    )
  }

  private addToActiveRequests(url: string): void {
    const currentValue = this.activeRequestsSubject.value
    const updatedValue = [...currentValue, url]
    this.activeRequestsSubject.next(updatedValue)
  }

  private addToQueuedRequests(url: string): void {
    const currentValue = this.queuedRequestsSubject.value
    const updatedValue = [...currentValue, url]
    this.queuedRequestsSubject.next(updatedValue)
  }

  private removeFromActiveRequests(url: string): void {
    const currentValue = this.activeRequestsSubject.value
    const index = currentValue.findIndex((value) => value === url)
    const updatedValue = currentValue.filter((_, i) => i !== index)
    this.activeRequestsSubject.next(updatedValue)
  }

  private removeFromQueuedRequests(url: string): void {
    const currentValue = this.queuedRequestsSubject.value
    const index = currentValue.findIndex((value) => value === url)
    const updatedValue = currentValue.filter((_, i) => i !== index)
    this.queuedRequestsSubject.next(updatedValue)
  }

  private addToResponses(url: string, data: any, index: number): void {
    const currentValue = this.responsesSubject.value
    const updatedValue = [...currentValue, { index, request: url, data }]
    this.responsesSubject.next(updatedValue)

  }
}
