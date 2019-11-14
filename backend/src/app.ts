import { Application } from 'express';
import { Server } from 'http';
import { IParticipant, IMessage } from './interfaces';
import { client_events }  from "./client_events";
import { server_events } from "./server_events";

class App {
    app: Application;
    http: Server;
    io: any; 
    public participants: Map<string,IParticipant>;

    constructor(app: Application, http: Server, io: any){
        this.app = app;
        this.http = http;
        this.io = io;
        this.participants= new Map<string, IParticipant>();
        this.socketConfig()
    }

    socketConfig(): void {
        this.io.on(client_events.CONNECTION, (socket: any) => this.onConnection(socket))
    }

    onConnection(socket: any){
        socket.emit(server_events.CONNECTED, { message: `Welcome participiant ${socket.id}!`});
        this.authenticate(socket);
    }

    authenticate(socket: any){
        socket.on(client_events.AUTHENTICATE, (data: any)=> {
            const participiant = data as IParticipant;
            this.addParticipant(participiant, socket.id);
            this.socketSubsctiption(socket);
        });
    }

    socketSubsctiption(socket: any){
        socket.on(client_events.SEND_MESSAGE, (data: any) => {
            this.broadcastMessage(socket, data);
        })

        socket.on(client_events.DISCONNECT, () => {
            console.log('user disconnected');
            this.removeParticipant(socket.id);
        });
    }

    addParticipant(participant: IParticipant, socketId: string){
        this.participants.set(socketId, participant);
        this.updateParticipants(this.participants);
    }

    removeParticipant(socketId: string){
        this.participants.delete(socketId);
        this.updateParticipants(this.participants);
    }

    updateParticipants(participants: Map<string,IParticipant>){
        const dat = [ ...participants.values() ];
        this.io.emit(server_events.PARTICIPANTS_UPDATED,  dat);
        console.log(dat);
    }

    broadcastMessage(socket: any, message: string){
        const sender = this.participants.get(socket.id);
        const messageObj: IMessage = <IMessage>{ sender, text: message };
        socket.broadcast.emit(server_events.RECIVE_MESSAGE, messageObj);
    }

    public listen(port:number, callback?:(...args: any[]) => void):void{
        this.http.listen(port, callback);
    }
}

export {App}