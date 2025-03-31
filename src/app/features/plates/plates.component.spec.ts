import { ComponentFixture, TestBed } from '@angular/core/testing'
import { PlatesComponent } from './plates.component'
import { AppTestingModule } from '../../testing/app-testing.module'

describe('PlatesComponent', () => {
  let component: PlatesComponent
  let fixture: ComponentFixture<PlatesComponent>

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [AppTestingModule, PlatesComponent]
    })
      .compileComponents()
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(PlatesComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
