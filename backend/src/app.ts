import { Application } from 'express';
import { Server } from 'http';
import { IParticipant, IMessage } from './interfaces';
import { client_events }  from "./client_events";
import { server_events } from "./server_events";
import bodyParser = require('body-parser');

class App {
    app: Application;
    http: Server;
    io: any;
    public conferences: Map<string, IParticipant[]>;

    constructor(app: Application, http: Server, io: any) {
        this.app = app;
        this.http = http;
        this.io = io;
        this.conferences = new Map<string, IParticipant[]>();
        this.expressConfig();
    }

    expressConfig(): void {
        this.app.set('json spaces', 2);
        this.app.use(bodyParser.urlencoded({
            extended: true
        }));
        this.routes();
    }

    routes():void {
        this.app.get("/", (req, res) => {
            console.log(this.io);
            res.send('hello world');
        });

        this.app.get("/conf_list", (req, res) => {
            const conferences = [...this.conferences.keys()].map(item=> item.slice(1, item.length+1));
            console.log(conferences);
            res.json( conferences);
        });

        this.app.post("/create_conf", (req, res) =>{
            const { confName } = req.body;
            console.log(confName)
            const newRoom = this.addConference(confName);
            this.socketConfig(newRoom);
            res.json(confName);
        });
    }

    addConference(confName: string){
        const newConf = this.io.of(confName);
        this.conferences.set(newConf.name, []);
        return newConf;
    }

    socketConfig(io: any): void {
        io.on(client_events.CONNECTION, async (socket: any) => {
            console.log('on connected')
            try {
                const confName = io.name
                let participants = <IParticipant []> this.conferences.get(confName);
                console.log(participants)
                const { participant } = <any> await this.authenticate(socket, participants);
                this.setConfData(participants, participant);
                this.throwAuthenticated(socket, participant, confName.slice(1, confName.length+1));
                this.addParticipant(participants, participant, io);
                this.socketSubsctiption(participants, participant, confName, socket, io);
            } catch(err) {
                console.log(err)
            }
        })
    }

    setConfData(participants: IParticipant [], participant: IParticipant){
        if(!participants.length){
            participant.isCreator = true;
        }
    }

    throwAuthenticated(socket: any, participant: IParticipant, confName: string){
        socket.emit(server_events.AUTHENTICATED, { participant, confName });
    }

    async authenticate(socket: any, participants: IParticipant []){
        return new Promise( (resolve, reject) => {
            socket.on(client_events.AUTHENTICATE, (data: any)=> {
                console.log(data)
                const { participant } = data;
                if(this.isLoginUnique(participant.login, participants)){
                    resolve(data);
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

    socketSubsctiption(participants: IParticipant [], participant: IParticipant, confName: string, socket: any, io: any){
        socket.on(client_events.SEND_MESSAGE, (data: any) => {
            this.broadcastMessage(participant, socket, data);
        })
        socket.on(client_events.DISCONNECT, () => {
            this.removeParticipant(participants, participant, confName, io);
        });
    }

    addParticipant(participants: IParticipant [], participant: IParticipant, io: any){
        participants.push(participant);
        this.updateParticipants(participants, io);
    }

    removeParticipant(participants: IParticipant [], participant: IParticipant, confName: string, io: any){
        if((<IParticipant> participant).isCreator){
            this.removeAllParticipants(confName);
            return;
        }
        const itemIndx = participants.indexOf(participant);
        participants.splice(itemIndx, 1);
        this.updateParticipants(participants, io);
    }

    removeAllParticipants(confName: string) {
        const conf = this.io.of(confName);
        const sockets = conf.clients();
        //sockets.forEach((item: any) => console.log(item));

        conf.clients((error: any, clients: any) => {
            if (error) throw error;
            console.log(clients); // => [PZDoMHjiu8PYfRiKAAAF, Anw2LatarvGVVXEIAAAD]
        });

       // sockets.forEach((socket) => socket.disconnect());
        // conf.sockets.forEach(() => console.log('x'));
        // this.conferences.delete(confName);
    }

    updateParticipants(participants: IParticipant [], io: any){
        const dat = [ ...participants.values() ];
        io.emit(server_events.PARTICIPANTS_UPDATED,  dat);
        console.log(dat);
    }

    broadcastMessage(sender: IParticipant, socket: any, message: string){
        const messageObj: IMessage = <IMessage>{ sender, text: message };
        socket.broadcast.emit(server_events.RECIVE_MESSAGE, messageObj);
    }

    public listen(port:number, callback?:(...args: any[]) => void):void{
        this.http.listen(port, callback);
    }
}

export {App}
