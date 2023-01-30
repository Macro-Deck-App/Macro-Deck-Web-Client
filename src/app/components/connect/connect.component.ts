import { Component, OnInit } from '@angular/core';
import { Connection } from '../../models/connection';
import { SettingsService } from 'src/app/services/settings.service';
import { MatDialog } from '@angular/material/dialog';
import { AddConnectionDialogComponent } from '../add-connection-dialog/add-connection-dialog.component';

@Component({
  selector: 'app-connect',
  templateUrl: './connect.component.html',
  styleUrls: ['./connect.component.scss']
})
export class ConnectComponent implements OnInit {

  constructor(private settingsService: SettingsService,
    private dialog: MatDialog) { }

  ngOnInit(): void {
    this.loadConnections();
  }

  connecting: boolean = false;

  connections: Connection[] = [];


  openAddConnectionDialog(connection?:Connection): void {
    const dialogRef = this.dialog.open(AddConnectionDialogComponent);
    if (connection != null && connection != undefined) {
      dialogRef.componentInstance.setConnection(connection);
    }
    dialogRef.afterClosed().subscribe(() => {
      this.loadConnections();
    });
  }

  loadConnections(): void {
    this.connections = this.settingsService.getConnections();
  }

  connect(id: number): void {
  }

  editConnection(id: number): void {
    const connection = this.settingsService.getConnections().find(x => x.id == id);
    if (connection == null && connection == undefined) return;
    this.openAddConnectionDialog(connection);
  }

  deleteConnection(id: number): void {
    this.settingsService.deleteConnection(id);
    this.loadConnections();
  }


}
