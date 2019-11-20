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
    public participants: Map<any, IParticipant>;
    public confTheme: string = '';

    constructor(app: Application, http: Server, io: any) {
        this.app = app;
        this.http = http;
        this.io = io;
        this.participants = new Map<any, IParticipant>();
        this.socketConfig();
        this.expressConfig();
    }

    expressConfig(): void{
        this.app.set('json spaces', 2);

        this.app.use(bodyParser.urlencoded({
            extended: true
        }));
        this.routes();
    }

    routes():void {
        this.app.get("/", (req, res) => {
            res.send('hello world');
        });

        this.app.get("/conf_list", (req, res) =>{
            console.log([ ...this.participants.keys() ]);
            res.json([ ...this.participants.keys() ]);
        });

        this.app.post("/create_conf", (req, res) =>{
            console.log(req.body)
            const { conf } = req.body;
            this.confTheme = conf;
            this.io.of(conf);
            res.json(this.confTheme);
        });
    }

    socketConfig(): void {
        this.io.on(client_events.CONNECTION, async (socket: any) => {
            this.throwConnected(socket);
            try {
                const { participant, confTheme } = <any> await this.authenticate(socket);
                this.setConfData(participant, confTheme);
                this.throwAuthenticated(socket, participant);
                this.addParticipant(participant, socket);
                this.socketSubsctiption(socket);
            } catch(err) {
                console.log(err)
            }
        })
    }

    setConfData(participant: IParticipant, confTheme: string){
        if(!this.participants.size){
            participant.isCreator = true;
            this.confTheme = confTheme;
        }
    }

    throwConnected(socket: any) {
        socket.emit(server_events.CONNECTED, { confTheme: this.confTheme });
    }

    throwAuthenticated(socket: any, participant: IParticipant){
        socket.emit(server_events.AUTHENTICATED, { participant, confTheme: this.confTheme });
    }

    async authenticate(socket: any){
        return new Promise( (resolve, reject) => {
            socket.on(client_events.AUTHENTICATE, (data: any)=> {
                console.log(data)
                const { participant } = data;
                if(this.isLoginUnique(participant.login)){
                    resolve(data);
                }
                reject('ununique paricipant!');
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
            this.removeParticipant(socket);
        });
    }

    addParticipant(participant: IParticipant, socket: any){
        this.participants.set(socket, participant);
        this.updateParticipants(this.participants);
    }

    removeParticipant(socket: any){
        const participant = this.participants.get(socket);
        if((<IParticipant>participant).isCreator){
            this.removeAllParticipants();
        }
        this.participants.delete(socket);
        this.updateParticipants(this.participants);
    }

    removeAllParticipants(){
        [...this.participants.keys()].forEach(socket => socket.disconnect(true));
        this.participants.clear();
        this.confTheme = '';
    }

    updateParticipants(participants: Map<any, IParticipant>){
        const dat = [ ...participants.values() ];
        this.io.emit(server_events.PARTICIPANTS_UPDATED,  dat);
        console.log(dat);
    }

    broadcastMessage(socket: any, message: string){
        const sender = this.participants.get(socket);
        const messageObj: IMessage = <IMessage>{ sender, text: message };
        socket.broadcast.emit(server_events.RECIVE_MESSAGE, messageObj);
    }

    public listen(port:number, callback?:(...args: any[]) => void):void{
        this.http.listen(port, callback);
    }
}

export {App}
