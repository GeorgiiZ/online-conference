import { Application } from 'express';
import { Server } from 'http';
import { IParticipant, IMessage } from './interfaces/interfaces';
import { client_events }  from "./socket-event-types/client_events";
import { server_events } from "./socket-event-types/server_events";

const debug = require('debug')('app:ConferenceManager');

class ConferenceManager {
    app: Application;
    http: Server;
    io: any;
    public conferences: Map<string, IParticipant[]>;

    constructor(app: Application, http: Server, io: any) {
        this.app = app;
        this.http = http;
        this.io = io;
        this.conferences = new Map<string, IParticipant[]>();
    }

    public getConferences(){
        return [...this.conferences.keys()].map(item => item.slice(1, item.length+1));
    }

    public conferenceInit(confName: string){
        const newRoom = this.addConference(confName);
        this.socketConfig(newRoom);
    }

    addConference(confName: string){
        const newConf = this.io.of(confName);
        this.conferences.set(newConf.name, []);
        return newConf;
    }

    socketConfig(io: any): void {
        io.on(client_events.CONNECTION, async (socket: any) => {
            debug('on connected')
            try {
                const confName = io.name
                let participants = <IParticipant []> this.conferences.get(confName);
                const participant = <IParticipant> await this.authenticate(socket, participants);
                this.setParticipantData(participants, participant);
                await this.throwAuthenticated(socket, participant, confName.slice(1, confName.length+1));
                this.addParticipant(participants, participant, io);
                this.socketSubsctiption(participants, participant, socket, io);
            } catch(err) {
                debug(err)
            }
        })
    }

    setParticipantData(participants: IParticipant [], participant: IParticipant){
        if(!participants.length){
            participant.isCreator = true;
        }
    }

    async throwAuthenticated(socket: any, participant: IParticipant, confName: string){
        socket.emit(server_events.AUTHENTICATED, { participant, confName });
        return new Promise((resolve, reject) => {
            socket.on(client_events.CLIENT_INITIALIZED, (data: any) =>{
                resolve(data);
            })
        });
    }

    async authenticate(socket: any, participants: IParticipant []){
        return new Promise( (resolve, reject) => {
            socket.on(client_events.AUTHENTICATE, (data: any)=> {
                debug(data)
                const { participant } = data;
                if(this.isLoginUnique(participant.login, participants)){
                    resolve(participant);
                }
                reject('ununique paricipant!');
            });
        })
    }

    isLoginUnique(login: string, participants: IParticipant []): boolean{
        return ![...participants.values()]
                .map(x => x.login)
                .includes(login);
    }

    socketSubsctiption(participants: IParticipant [], participant: IParticipant, socket: any, io: any){
        socket.on(client_events.SEND_MESSAGE, (data: any) => {
            this.broadcastMessage(participant, socket, data);
        })
        socket.on(client_events.DISCONNECT, () => {
            this.removeParticipant(participants, participant, io);
        });
    }

    addParticipant(participants: IParticipant [], participant: IParticipant, io: any){
        participants.push(participant);
        this.updateParticipants(participants, io);
    }

    removeParticipant(participants: IParticipant [], participant: IParticipant, io: any){
        if((<IParticipant> participant).isCreator){
            this.removeAllParticipants(io, participants);
            return;
        }
        const itemIndx = participants.indexOf(participant);
        participants.splice(itemIndx, 1);
        this.updateParticipants(participants, io);
    }

    removeAllParticipants(io: any, participants: IParticipant []) {
        io.clients((error: any, clients: any) => {
            if (error) throw error;
            clients.forEach( (socketId: any) => {
                io.sockets[socketId] && io.sockets[socketId].disconnect()
            })
        });
        participants.length = 0;
        this.conferences.delete(io.name);
    }

    updateParticipants(participants: IParticipant [], io: any){
        const dat = participants && [...participants.values()];
        io.emit(server_events.PARTICIPANTS_UPDATED,  dat);
        debug(dat);
    }

    broadcastMessage(sender: IParticipant, socket: any, message: string){
        const messageObj: IMessage = <IMessage>{ sender, text: message };
        socket.broadcast.emit(server_events.RECIVE_MESSAGE, messageObj);
    }
}

export { ConferenceManager }
