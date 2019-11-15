import { Application } from 'express';
import { Server } from 'http';
import { IParticipant, IMessage } from './interfaces';
import { client_events }  from "./client_events";
import { server_events } from "./server_events";

class App {
    app: Application;
    http: Server;
    io: any; 
    public participants: Map<string, IParticipant>;
    public confTheme: string = '';

    constructor(app: Application, http: Server, io: any) {
        this.app = app;
        this.http = http;
        this.io = io;
        this.participants = new Map<string, IParticipant>();
        this.socketConfig();
    }

    socketConfig(): void {
        this.io.on(client_events.CONNECTION, async (socket: any) => {
            try {
                const { participant, confTheme } = <any> await this.authenticate(socket);
                this.setConfData(participant, confTheme);
                this.onAuthenticated(socket);
                this.addParticipant(participant, socket.id);
                this.socketSubsctiption(socket);
            } catch(err) {
                console.log('ununique paricipant!')
            } 
        })
    }

    setConfData(participant: IParticipant, confTheme: string){
        if(!this.participants.size){
            participant.isCreator = true;
            this.confTheme = confTheme;
        }
    }

    onAuthenticated(socket: any) {
        socket.emit(server_events.AUTHENTICATED, { confTheme: this.confTheme });
    }

    async authenticate(socket: any){
        return new Promise( (resolve, reject) => {
            socket.on(client_events.AUTHENTICATE, (data: any)=> {
                console.log(data)
                const { participant } = data;
                if(this.isLoginUnique(participant.login)){
                    resolve(data);
                }
                reject();
            });
        })
    }

    isLoginUnique(login: string): boolean{
        return ![...this.participants.values()]
                .map(x => x.login)
                .includes(login);
    }

    socketSubsctiption(socket: any){
        socket.on(client_events.SEND_MESSAGE, (data: any) => {
            this.broadcastMessage(socket, data);
        })

        socket.on(client_events.DISCONNECT, () => {
            console.log('user disconnected');
            this.removeParticipant(socket.id);
            const participant = this.participants.get(socket.id);
            // if((<IParticipant>participant).isCreator){
            //     this.participants.clear();
            // }
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