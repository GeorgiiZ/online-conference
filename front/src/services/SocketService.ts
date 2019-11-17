import io from 'socket.io-client'
import { IMessage, IParticipant } from '@/models/interfaces';
import { server_events } from "./server_events";
import { client_events }  from "./client_events";


class SocketService {
    host: string;
    socket: any;
    user: IParticipant | null = null;
    public confTheme: string = '';
    public messages: IMessage [] = [];
    public participants: IParticipant [] = [];

    constructor(host: string){
        this.host = host;
        this.initConnection();
    }

    public initConnection(): void{
        this.socket = io(this.host);
        this.setOnConnected(this.socket);
    }

    public joinConf(user: IParticipant, confTheme: string){
        this.authenticate(this.socket, user, confTheme);
        this.subscriptionsConfig(this.socket, user);
    }

    public sendMessage(message: string){
        if(!message) return;
        this.socket.emit(client_events.SEND_MESSAGE, message);
        this.messages.push(<IMessage> { sender: this.user, text: message, selfMessage: true });
    }

    setOnConnected(socket: any){
        socket.on(server_events.CONNECTED, (data: any) => {
            const { confTheme } = data;
            this.confTheme = confTheme;
        });
    }

    subscriptionsConfig(socket: any, user: IParticipant): void {
        socket.on(server_events.AUTHENTICATED, (data: any) => {
            this.onAuthenticated(data);
        });

        socket.on(server_events.PARTICIPANTS_UPDATED, (participiants: any) => {
            this.onParticipantsUpdated(participiants);
        });

        socket.on(server_events.RECIVE_MESSAGE, (message: any) => {
            this.onMessageRecive(message);
        });
    }

    onDisconnect(callback: any){
        this.socket.on(client_events.DISCONNECT, (message: any) => {
            callback();
        });
    }

    authenticate(socket: any, user: IParticipant, confTheme: string){
        socket.emit(client_events.AUTHENTICATE, { participant: user, confTheme });
        console.log(user)
    }

    onAuthenticated(data: any){
        const { participant: user, confTheme: confTheme } = data;
        this.user = user;
        this.confTheme = confTheme;
    }

    onParticipantsUpdated(participiants: any){
        this.participants = participiants;
    }

    onMessageRecive(message: any){
        this.messages.push(<IMessage> Object.assign({}, message, { selfMessage: false }));
    }

}

export { SocketService }