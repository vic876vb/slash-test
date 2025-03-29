import { Component } from '@angular/core'
import { ALPHABETIC_BASE, cumulativeThreshold, getThreshold, LETTERS, NUMERIC_BASE, PLATE_DIGITS, THRESHOLDS } from './plates.constants'
import { MatButtonModule } from '@angular/material/button'
import { MatIconModule } from '@angular/material/icon'
import { MatInputModule } from '@angular/material/input'
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms'

@Component({
  selector: 'app-plates',
  standalone: true,
  imports: [MatButtonModule, MatIconModule, MatInputModule, ReactiveFormsModule],
  templateUrl: './plates.component.html',
  styleUrls: ['./plates.component.scss']
})
export class PlatesComponent {
  // from `000000` to `999999`
  threshold1 = NUMERIC_BASE ** PLATE_DIGITS
  // from `00000A` to `99999Z`
  threshold2 = (NUMERIC_BASE ** (PLATE_DIGITS - 1)) * ALPHABETIC_BASE ** (PLATE_DIGITS - 5)
  // from `0000AA` to `9999ZZ`
  threshold3 = (NUMERIC_BASE ** (PLATE_DIGITS - 2)) * ALPHABETIC_BASE ** (PLATE_DIGITS - 4)
  // from `000AAA` to `999ZZZ`
  threshold4 = (NUMERIC_BASE ** (PLATE_DIGITS - 3)) * ALPHABETIC_BASE ** (PLATE_DIGITS - 3)
  // from `00AAAA` to `99ZZZZ`
  threshold5 = (NUMERIC_BASE ** (PLATE_DIGITS - 4)) * ALPHABETIC_BASE ** (PLATE_DIGITS - 2)
  // from `0AAAAA` to `9ZZZZZ`
  threshold6 = (NUMERIC_BASE ** (PLATE_DIGITS - 5)) * ALPHABETIC_BASE ** (PLATE_DIGITS - 1)
  // from `AAAAAA` to `ZZZZZZ`
  threshold7 = ALPHABETIC_BASE ** PLATE_DIGITS

  licensePlateControl: FormControl<string> = new FormControl(null, [Validators.required, Validators.pattern(/\d/)]);
  licensePlate: string

  constructor() { }

  public setLicensePlate(): void {
    this.licensePlate = this.getLicensePlate(Number(this.licensePlateControl.value))
  }

  private getLicensePlate(number: number): string {
    if (isNaN(number)) return null
    if (!this.isInRange(number)) throw new Error('License plate out of range')
    if (number <= this.threshold1) return this.formatNumeric(number - 1, PLATE_DIGITS) //String(number - 1).padStart(PLATE_DIGITS, '0')

    const ranges = [
      { threshold: cumulativeThreshold(2), digits: 5, letters: 1 },
      { threshold: cumulativeThreshold(3), digits: 4, letters: 2 },
      { threshold: cumulativeThreshold(4), digits: 3, letters: 3 },
      { threshold: cumulativeThreshold(5), digits: 2, letters: 4 },
      { threshold: cumulativeThreshold(6), digits: 1, letters: 5 },
      { threshold: cumulativeThreshold(7), digits: 0, letters: 6 },
    ]

    for (const range of ranges) {
      if (number <= range.threshold) return this.calculateParts(number - (range.threshold - getThreshold(range.digits, range.letters)), range.digits, range.letters)
    }

    // if (number <= (this.threshold1 + this.threshold2)) {
    //   const numericRange = 10 ** (PLATE_DIGITS - 1)
    //   const diff = number - this.threshold1
    //   const numericPart = Math.floor((diff - 1) % numericRange)
    //   const letterPart = LETTERS[Math.floor((diff - 1) / numericRange)]
    //   return String(numericPart).padStart(PLATE_DIGITS - 1, '0') + letterPart
    // }
    // if (number <= (this.threshold1 + this.threshold2 + this.threshold3)) {
    //   const numericRange = 10 ** (PLATE_DIGITS - 2)
    //   const diff = number - (this.threshold1 + this.threshold2)
    //   const numericPart = Math.floor((diff - 1) % numericRange)
    //   const letterIndex = Math.floor((diff - 1) / numericRange)
    //   const firstLetter = LETTERS[letterIndex / ALPHABETIC_BASE]
    //   const secondLetter = LETTERS[letterIndex % ALPHABETIC_BASE]
    //   return String(numericPart).padStart(PLATE_DIGITS - 2, '0') + firstLetter + secondLetter
    // }
    // if (number <= (this.threshold1 + this.threshold2 + this.threshold3 + this.threshold4)) {
    //   const numericRange = 10 ** (PLATE_DIGITS - 3)
    //   const diff = number - (this.threshold1 + this.threshold2 + this.threshold3)
    //   const numericPart = Math.floor((diff - 1) % numericRange)
    //   const letterIndex = Math.floor((diff - 1) / numericRange)
    //   const firstLetter = LETTERS[Math.floor(letterIndex / (ALPHABETIC_BASE ** 2))]
    //   const secondLetter = LETTERS[Math.floor((letterIndex % (ALPHABETIC_BASE ** 2)) / ALPHABETIC_BASE)]
    //   const thirdLetter = LETTERS[letterIndex % ALPHABETIC_BASE]
    //   return String(numericPart).padStart(PLATE_DIGITS - 3, '0') + firstLetter + secondLetter + thirdLetter
    // }
    // if (number <= this.threshold1 + this.threshold2 + this.threshold3 + this.threshold4 + this.threshold5) {
    //   const numericRange = 10 ** (PLATE_DIGITS - 4)
    //   const diff = number - (this.threshold1 + this.threshold2 + this.threshold3 + this.threshold4)
    //   const numericPart = Math.floor((diff - 1) % numericRange)
    //   const letterIndex = Math.floor((diff - 1) / numericRange)
    //   const firstLetter = LETTERS[Math.floor(letterIndex / (ALPHABETIC_BASE ** 3))]
    //   const secondLetter = LETTERS[Math.floor((letterIndex % (ALPHABETIC_BASE ** 3)) / (ALPHABETIC_BASE ** 2))]
    //   const thirdLetter = LETTERS[Math.floor((letterIndex % (ALPHABETIC_BASE ** 2)) / ALPHABETIC_BASE)]
    //   const fourthLetter = LETTERS[letterIndex % ALPHABETIC_BASE]
    //   return String(numericPart).padStart(PLATE_DIGITS - 4, '0') + firstLetter + secondLetter + thirdLetter + fourthLetter
    // }
    // if (number <= this.threshold1 + this.threshold2 + this.threshold3 + this.threshold4 + this.threshold5 + this.threshold6) {
    //   const numericRange = 10 ** (PLATE_DIGITS - 5)
    //   const diff = number - (this.threshold1 + this.threshold2 + this.threshold3 + this.threshold4 + this.threshold5)
    //   const numericPart = Math.floor((diff - 1) % numericRange)
    //   const letterIndex = Math.floor((diff - 1) / numericRange)
    //   const firstLetter = LETTERS[Math.floor(letterIndex / (ALPHABETIC_BASE ** 4))]
    //   const secondLetter = LETTERS[Math.floor((letterIndex % (ALPHABETIC_BASE ** 4)) / (ALPHABETIC_BASE ** 3))]
    //   const thirdLetter = LETTERS[Math.floor((letterIndex % (ALPHABETIC_BASE ** 3)) / (ALPHABETIC_BASE ** 2))]
    //   const fourthLetter = LETTERS[Math.floor((letterIndex % (ALPHABETIC_BASE ** 2)) / ALPHABETIC_BASE)]
    //   const fifthLetter = LETTERS[letterIndex % ALPHABETIC_BASE]
    //   return String(numericPart).padStart(PLATE_DIGITS - 5, '0') + firstLetter + secondLetter + thirdLetter + fourthLetter + fifthLetter
    // }
    // if (number <= this.threshold1 + this.threshold2 + this.threshold3 + this.threshold4 + this.threshold5 + this.threshold6 + this.threshold7) {
    //   const diff = number - (this.threshold1 + this.threshold2 + this.threshold3 + this.threshold4 + this.threshold5 + this.threshold6)
    //   const letterIndex = Math.floor(diff - 1)
    //   const firstLetter = LETTERS[Math.floor(letterIndex / (ALPHABETIC_BASE ** 5))]
    //   const secondLetter = LETTERS[Math.floor((letterIndex % (ALPHABETIC_BASE ** 5)) / (ALPHABETIC_BASE ** 4))]
    //   const thirdLetter = LETTERS[Math.floor((letterIndex % (ALPHABETIC_BASE ** 4)) / (ALPHABETIC_BASE ** 3))]
    //   const fourthLetter = LETTERS[Math.floor((letterIndex % (ALPHABETIC_BASE ** 3)) / (ALPHABETIC_BASE ** 2))]
    //   const fifthLetter = LETTERS[Math.floor((letterIndex % (ALPHABETIC_BASE ** 2)) / ALPHABETIC_BASE)]
    //   const sixthLetter = LETTERS[letterIndex % ALPHABETIC_BASE]
    //   return firstLetter + secondLetter + thirdLetter + fourthLetter + fifthLetter + sixthLetter
    // }
    return null
  }

  private formatNumeric(value: number, length: number): string {
    return String(value).padStart(length, '0')
  }

  private formatAlphabetic(index: number, count: number): string {
    let result: string = ''
    for (let i = count - 1; i >= 0; i--) {
      result = LETTERS[Math.floor(index / (ALPHABETIC_BASE ** i)) % ALPHABETIC_BASE] + result
    }
    return result
  }

  private calculateParts(diff: number, numericDigits: number, letterCount: number): string {
    const numericPart = this.formatNumeric(Math.floor((diff - 1) % (NUMERIC_BASE ** numericDigits)), numericDigits)
    const letterPart = this.formatAlphabetic(Math.floor((diff - 1) / (NUMERIC_BASE ** numericDigits)), letterCount)
    return `${numericDigits > 0 ? numericPart : ''}${letterPart}`
  }

  private isInRange(number: number): boolean {
    return number > 0 && number <= (this.threshold1 + this.threshold2 + this.threshold3 + this.threshold4 + this.threshold5 + this.threshold6 + this.threshold7)
  }
}
