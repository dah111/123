import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
@Injectable({
  providedIn: 'root',
})
export class WebSocketService {
  private webSocket: Socket;
  constructor() {
    this.webSocket = new Socket({
      url: "http://localhost:4000",
      options: {
        transports: ['websocket']
      },
    });
  }

  // constructor(private socket: Socket) {}

  connectSocket() {
    this.webSocket.connect();
  }

  receiveNewOrder() {
    return this.webSocket.fromEvent('newOrder');
  }

  disconnectSocket() {
    this.webSocket.disconnect();
  }
}
