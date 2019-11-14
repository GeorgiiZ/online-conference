import { IParticipant } from './interfaces';
import io from 'socket.io-client';
import { client_events }  from "./client_events";
import { server_events } from "./server_events";

var socket = io.connect("http://localhost:3000");

socket.on(server_events.CONNECTED, (data: any) => {
  console.log(data);
  socket.emit(client_events.AUTHENTICATE, { login: 'Cool_Boy_JO', name: 'Georgii Zennurov' });
  socket.emit(client_events.SEND_MESSAGE, 'Hiii!');
});

socket.on(server_events.PARTICIPANTS_UPDATED, (data: any) => {
  const participants = data as Map<string, IParticipant>;
  console.log(participants);
});

socket.on(server_events.RECIVE_MESSAGE, (data: any) => {
  console.log(data);
});


