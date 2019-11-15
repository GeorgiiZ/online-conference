import io from 'socket.io-client'
import { IMessage, IParticipant } from '@/models/interfaces';
import { server_events } from "./server_events";
import { client_events }  from "./client_events";


class SocketService {
    host: string;
    socket: any;
    user: IParticipant;
    public confTheme: string = '';
    public messages: IMessage [] = [];
    public participants: IParticipant [] = [];

    constructor(host: string, user: IParticipant, confTheme: string){
        this.host = host;
        this.user = user;
        this.initConnection(user, confTheme);
    }

    public initConnection(user: IParticipant, confTheme: string): void{
        this.socket = io(this.host);
        this.authenticate(this.socket, this.user, confTheme);
        this.subscriptionsConfig(this.socket, user);
    }

    public sendMessage(message: string){
        if(!message) return;
        this.socket.emit(client_events.SEND_MESSAGE, message);
        this.messages.push(<IMessage> { sender: this.user, text: message, selfMessage: true });
    }

    subscriptionsConfig(socket: any, user: IParticipant): void {
        socket.on(server_events.AUTHENTICATED, (data: any) => {
            const { confTheme } = data;
            this.confTheme = confTheme;
        });

        socket.on(server_events.PARTICIPANTS_UPDATED, (participiants: any) => {
            this.onParticipantsUpdated(participiants);
          });

        socket.on(server_events.RECIVE_MESSAGE, (message: any) => {
            this.onMessageRecive(message);
        });

        socket.on(client_events.DISCONNECT, (message: any) => {
            //this.onMessageRecive(message);
        });
    }

    authenticate(socket: any, user: IParticipant, confTheme: string){
        socket.emit(client_events.AUTHENTICATE, { participant: user, confTheme });
        console.log(socket);
    }

    onParticipantsUpdated(participiants: any){
        this.participants = participiants;
    }

    onMessageRecive(message: any){
        this.messages.push(<IMessage> Object.assign({}, message, { selfMessage: false }));
    }

}

export { SocketService }