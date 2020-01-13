import io from 'socket.io-client'
import { IMessage, IParticipant } from '@/models/interfaces';
import { server_events } from "./server_events";
import { client_events }  from "./client_events";

import axios from "axios";
const querysting = require( "querystring")

class SocketService {
    socket: any;
    participant: IParticipant | null = null;
    messages: IMessage [] = [];
    participants: IParticipant [] = [];
    public disconnectCallBack: any;

    constructor(messages: IMessage [], participants: IParticipant []){
        this.messages = messages;
        this.participants = participants;
    }

    public async getConferences(){
        const responce = await axios.get('/conf_list');
        return  responce.data;
    }

    public async createConference(participant: IParticipant, confName: string){
        const data = querysting.stringify({ confName })
        await axios.post("/create_conf", data);
        return await this.joinConf(participant, confName);
    }

    public async joinConf(participant: IParticipant, confName: string){
        this.socket = io(`/${ confName }`);
        const {
            participant: participantRefreshed,
            confName: confNameRefreshed
        } = <any> await this.authenticate(this.socket, participant, confName);
        this.participant = participantRefreshed;
        this.subscriptionsConfig(this.socket);
        return confNameRefreshed;
    }

    public sendMessage(message: string){
        if(!message) return;
        this.socket.emit(client_events.SEND_MESSAGE, message);
        this.messages.push(<IMessage> { sender: this.participant, text: message, selfMessage: true });
    }

    subscriptionsConfig(socket: any): void {
        socket.on(server_events.PARTICIPANTS_UPDATED, (participants: any) => {
            this.onParticipantsUpdated(participants);
        });
        socket.on(server_events.RECIVE_MESSAGE, (message: any) => {
            this.onMessageRecive(message);
        });
        socket.on(client_events.DISCONNECT, (message: any) => {
            this.disconnectCallBack();
        });
    }

    async authenticate(socket: any, participant: IParticipant, confName: string){
        return new Promise( resolve => {
            socket.emit(client_events.AUTHENTICATE, { participant, confName });
            socket.on(server_events.AUTHENTICATED, (credentials: any) => {
                resolve(credentials);
            });
        })
    }

    onParticipantsUpdated(participants: IParticipant []){
        this.participants.splice(0, this.participants.length, ...participants);
    }

    onMessageRecive(message: any){
        this.messages.push(<IMessage> Object.assign({}, message, { selfMessage: false }));
    }
}

export { SocketService }
