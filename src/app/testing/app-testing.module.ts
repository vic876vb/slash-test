import { HttpClientTestingModule } from '@angular/common/http/testing'
import { NgModule } from '@angular/core'
import { NoopAnimationsModule } from '@angular/platform-browser/animations'
import { BrowserTestingModule } from '@angular/platform-browser/testing'

@NgModule({
  imports: [
    NoopAnimationsModule,
    HttpClientTestingModule
  ]
})
export class AppTestingModule { }
