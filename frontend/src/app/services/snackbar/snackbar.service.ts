import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class SnackbarService {

  constructor(private snackBar: MatSnackBar) { }

  public static Level = {
    INFO: 'snackbar-info',
    SUCCESS: 'snackbar-success',
    WARN: 'snackbar-warn',
    ERROR: 'snackbar-error'
  }

  open(message: string, level: string, action: string = '', duration: number =  5000) {
    this.snackBar.open(message, action, {
      duration: duration,
      panelClass: [level, 'snackbar']
    });
  }
}
