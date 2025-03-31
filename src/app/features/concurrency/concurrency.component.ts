import { HttpClient } from '@angular/common/http'
import { Component, OnInit } from '@angular/core'
import { BehaviorSubject, catchError, from, map, mergeMap, Observable, of, tap, toArray } from 'rxjs'
import { MAX_CONCURRENCY } from './concurrency.constants'
import { CommonModule } from '@angular/common'
import { MatCardModule } from '@angular/material/card'
import { MatExpansionModule } from '@angular/material/expansion'

@Component({
  selector: 'app-concurrency',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatExpansionModule],
  templateUrl: './concurrency.component.html',
  styleUrls: ['./concurrency.component.scss'],
})
export class ConcurrencyComponent implements OnInit {
  private responsesSubject: BehaviorSubject<Object[]> = new BehaviorSubject([])
  public responses = this.responsesSubject.asObservable()

  constructor(private http: HttpClient) { }

  ngOnInit() {
    const urls = [
      'https://countriesnow.space/api/v0.1/countries/population/cities',
      'https://countriesnow.space/api/v0.1/countries/population',
      'https://countriesnow.space/api/v0.1/countries/positions',
      'https://countriesnow.space/api/v0.1/countries/flag/unicode',
      // 'https://countriesnow.space/api/v0.1/countries/flag/images',
      // 'https://countriesnow.space/api/v0.1/countries/currency',
      // 'https://countriesnow.space/api/v0.1/countries/capital',
      // 'https://countriesnow.space/api/v0.1/countries',
      // 'https://countriesnow.space/api/v0.1/countries/iso',
      // 'https://countriesnow.space/api/v0.1/countries/codes',
      // 'https://countriesnow.space/api/v0.1/countries/info?returns=currency,flag,unicodeFlag,dialCode',
      // 'https://countriesnow.space/api/v0.1/countries/states',
    ]

    this.fetchUrls(urls, MAX_CONCURRENCY).subscribe()
  }

  public fetchUrls(urls: string[], concurrency: number): Observable<Object[]> {
    return from(urls).pipe(
      mergeMap((url) => this.http.get<{ error: boolean, msg: string, data: any }>(url).pipe(
        map(({ error, msg }) => ({ error, msg })),
        catchError((error) => of({ error: true, msg: String(error) })),
        tap((res) => this.addToResponses(res))
      ), concurrency),
      toArray()
    )
  }

  private addToResponses(value: Object): void {
    const currentValue = this.responsesSubject.value
    const updatedValue = [...currentValue, value]
    this.responsesSubject.next(updatedValue)
  }
}
