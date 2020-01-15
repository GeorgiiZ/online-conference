import { IParticipant } from './interfaces/interfaces';
import io from 'socket.io-client';
import { client_events }  from "./socket-event-types/client_events";
import { server_events } from "./socket-event-types/server_events";


const port = process.env.PORT || 4000;

var socket = io.connect(`http://localhost:${ port }/test-conf1`);

socket.emit(client_events.AUTHENTICATE, { participant: { login: 'Cool_Boy_JO2' }, confTheme: 'Some conf' });

socket.emit(client_events.CLIENT_INITIALIZED, "");

socket.emit(client_events.SEND_MESSAGE, 'Hiii!');

socket.on(server_events.PARTICIPANTS_UPDATED, (data: any) => {
  const participants = data as Map<string, IParticipant>;
  console.log(participants);
});

socket.on(server_events.RECIVE_MESSAGE, (data: any) => {
  console.log(data);
});




