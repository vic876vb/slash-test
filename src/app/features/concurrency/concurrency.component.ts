import { HttpClient } from '@angular/common/http'
import { Component, OnInit } from '@angular/core'
import { catchError, delay, finalize, from, map, mergeMap, Observable, of, switchMap, tap } from 'rxjs'

const MAX_CONCURRENCY = 3

@Component({
  selector: 'app-concurrency',
  standalone: true,
  imports: [],
  templateUrl: './concurrency.component.html',
  styleUrls: ['./concurrency.component.scss'],
})
export class ConcurrencyComponent implements OnInit {

  host = 'https://sitaopen.api.aero/connection'
  queue: Observable<any>[] = [];

  // names = [
  //   "alice", "bob", "charlie", "daisy", "edward",
  //   "fiona", "george", "hannah", "ian", "jasmine",
  //   "kevin", "luna", "michael", "nora", "oliver",
  //   "paula", "quentin", "rachel", "sam", "tina",
  //   "ulysses", "violet", "walter", "xavier", "yasmine", "zach"
  // ]

  constructor(private http: HttpClient) { }

  ngOnInit() {
    // const urls = Array.from({ length: 25 }, () => 'https://official-joke-api.appspot.com/random_joke')
    // const responses: any[] = []
    // console.log(urls)

    // this.queue = urls.map((url, index) => this.http.get(url).pipe(switchMap((response) => of(response).pipe(finalize(() => responses.push({ index, req: url, res: response }))))))

    // // from(urls)
    // //   .pipe(
    // //     mergeMap((url, index) => this.http.get(url).pipe(
    // //       delay(index * 1_000),
    // //       switchMap((response) => of(response).pipe(
    // //         catchError((error) => of(error)),
    // //         finalize(() => responses.push({ index, req: url, res: response }))
    // //       ))
    // //     ), MAX_CONCURRENCY),
    // //     // map(({ result, error }) => {
    // //     //   if (result) {
    // //     //     results.push(result)
    // //     //   }
    // //     //   if (error) {
    // //     //     results.push(error)
    // //     //   }
    // //     // }),
    // //     tap((data) => console.log('data', data)),
    // //     tap(() => console.log('responses', responses))
    // //     // () => of(responses)
    // //   )
    // //   .subscribe()

    // this.http.get('https://official-joke-api.appspot.com/random_joke').pipe(tap((d) => console.log('dq', d)), catchError((error) => of(null))).subscribe()
  }

}
