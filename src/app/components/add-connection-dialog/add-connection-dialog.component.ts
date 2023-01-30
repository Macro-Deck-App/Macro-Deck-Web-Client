import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroupDirective, NgForm, Validators} from '@angular/forms';
import {ErrorStateMatcher} from '@angular/material/core';
import { Connection } from 'src/app/models/connection';
import { SettingsService } from 'src/app/services/settings.service';
import { MatDialogRef } from '@angular/material/dialog';

export class AddConnectionErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-add-connection-dialog',
  templateUrl: './add-connection-dialog.component.html',
  styleUrls: ['./add-connection-dialog.component.scss']
})
export class AddConnectionDialogComponent implements OnInit {

  constructor(private settingsService: SettingsService,
    private dialogRef: MatDialogRef<AddConnectionDialogComponent>) { }

  connection: Connection = new Connection();

  ngOnInit(): void {
  }

  public setConnection(connection:Connection): void {
    this.connection = connection;
    this.loadForm();
  }

  nameFormControl = new FormControl('', [Validators.required]);
  hostFormControl = new FormControl('', [Validators.required]);
  portFormControl = new FormControl('8191', [Validators.required]);
  matcher = new AddConnectionErrorStateMatcher();

  loadForm(): void {
    this.nameFormControl.setValue(this.connection.displayName);
    this.hostFormControl.setValue(this.connection.ipAddress);
    this.portFormControl.setValue(this.connection.port.toString());
  }

  save(): void {
    if (this.connection.id === 0) {
      this.connection.id = Math.floor(Math.random() * 999999999);
    }
    this.connection.displayName = this.nameFormControl.value!;
    this.connection.ipAddress = this.hostFormControl.value!;
    this.connection.port = parseInt(this.portFormControl.value!);
    this.settingsService.addConnection(this.connection);
    this.dialogRef.close('Added connection');
  }

}
