import io from 'socket.io-client'
import { IMessage, IParticipant } from '@/models/interfaces';
import { server_events } from "./server_events";
import { client_events }  from "./client_events";


class SocketService {
    host: string;
    socket: any;
    user: IParticipant;
    public messages: IMessage [] = [];
    public participants: IParticipant [] = [];

    constructor(host: string, user: IParticipant){
        this.host = host;
        this.user = user;
        this.initConnection(user)
    }

    public initConnection(user: IParticipant): void{
        this.socket = io(this.host);
        this.subscriptionsConfig(this.socket, user);
    }

    public sendMessage(message: string){
        if(!message) return;
        this.socket.emit(client_events.SEND_MESSAGE, message);
        this.messages.push( <IMessage>{ sender: this.user, text: message, selfMessage: true } );
    }

    subscriptionsConfig(socket: any, user: IParticipant): void {
        socket.on(server_events.CONNECTED, (data: any) => {
            this.onConnected(socket, user);
        });

        socket.on(server_events.PARTICIPANTS_UPDATED, (participiants: any) => {
            console.log(participiants);
            this.onParticipantsUpdated(participiants);
          });

        socket.on(server_events.RECIVE_MESSAGE, (message: any) => {
            this.onMessageRecive(message);
        });
    }

    onConnected(socket: any, user: IParticipant){
        socket.emit(client_events.AUTHENTICATE, Object.assign({}, user));
    }

    onParticipantsUpdated(participiants: any){
        this.participants = participiants;
    }

    onMessageRecive(message: any){
        this.messages.push(<IMessage> Object.assign({}, message, { selfMessage: false }));
    }

}

export { SocketService }