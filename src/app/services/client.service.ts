import { Injectable, Component, EventEmitter, Input, Output } from '@angular/core';
import { RxWebsocket, WebsocketService } from './websocket.service';
import { Subject, Observable } from 'rxjs'

@Injectable({
  providedIn: 'root'
})
export class ClientService {

  @Output() connectionChanged = new EventEmitter();

  public connected: boolean = false;

  constructor(private webSocketService: WebsocketService) {

  }

  webSocketClient?: RxWebsocket;

  webSocketUrl: string = "";


  public connect(host: string): void {
    this.webSocketClient = this.webSocketService.websocket(host);
    this.webSocketClient.onOpen.subscribe(() => {

    });
    this.webSocketClient.onClose.subscribe(() => {

    });
    this.webSocketClient.onError.subscribe(() => {

    });
  }

  public isConnected: boolean = (this.webSocketClient != null && this.webSocketClient != undefined && this.webSocketClient.readyState() == 1);

}
