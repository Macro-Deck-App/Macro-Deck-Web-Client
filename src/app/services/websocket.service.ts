import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs'

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {

  constructor() { }
  websocket(url:string){
    return new RxWebsocket(url)
  }

}

export class RxWebsocket {
  ws: WebSocket;

  constructor(private url: string){
    this.ws = new WebSocket(url)
    this.ws.onerror = e => this.errorSubject.next(e);
    this.ws.onclose = e => this.closeSubject.next(e);
    this.ws.onmessage = e => this.messageSubject.next(e);
    this.ws.onopen = e => this.openSubject.next(e);
  }

  private errorSubject = new Subject<Event>();
  private closeSubject = new Subject<CloseEvent>();
  private messageSubject = new Subject<MessageEvent>();
  private openSubject = new Subject<Event>();

  onError: Observable<Event> = this.errorSubject
  onClose: Observable<CloseEvent>  = this.closeSubject
  onMessage: Observable<MessageEvent>  = this.messageSubject
  onOpen: Observable<Event>  = this.openSubject

  readyState(): number {
    return this.ws.readyState;
  }

  send(msg: string): void {
    this.ws.send(msg);
  }

  close(): void {
    this.ws?.close;
  }
}
