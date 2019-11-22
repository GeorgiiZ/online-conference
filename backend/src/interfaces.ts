interface IParticipant {
    socket: any;
    login: string;
    isCreator: boolean;
    avatar: string;
}

interface IMessage {
    sender: IParticipant;
    text: string;
    selfMessage: boolean;
}

export { IParticipant, IMessage }
