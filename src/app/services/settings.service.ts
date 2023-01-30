import { Injectable } from '@angular/core';
import { Connection } from '../models/connection';
import { StorageService } from './storage.service';


const connectionsKey = "connections";

@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  constructor(private storageService: StorageService) { }


  public getConnections(): Connection[] {
    const connectionsData = this.storageService.getData(connectionsKey) ?? "";
    if (connectionsData === '') return [];
    return JSON.parse(connectionsData);
  }

  public addConnection(connection: Connection): void {
    let connectionsObject:Connection[] = [];
    try {
      const connectionsData = this.storageService.getData(connectionsKey) ?? "";
      connectionsObject = JSON.parse(connectionsData);
      const existingConnectionObject = connectionsObject.findIndex(x => x.id === connection.id);
      if (existingConnectionObject > -1) {
        connectionsObject.splice(existingConnectionObject, 1);
      }
    } catch {
      // ignore
    }
    connectionsObject.push(connection);
    this.storageService.saveData(connectionsKey, JSON.stringify(connectionsObject));
  }

  public deleteConnection(id: number) {
    try {
      const connectionsData = this.storageService.getData(connectionsKey) ?? "";
      let connectionsObject:Connection[] = JSON.parse(connectionsData);
      const connectionIndex = connectionsObject.findIndex(x => x.id == id);
      if (connectionIndex > -1) {
        connectionsObject.splice(connectionIndex, 1);
      }
      this.storageService.saveData(connectionsKey, JSON.stringify(connectionsObject));
    } catch {
      console.log("Unable to delete connection");
    }
  }


}
