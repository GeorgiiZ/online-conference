interface IMessage {
    sender: IParticipant;
    text: string;
    selfMessage: boolean;
}

interface IParticipant {
    login: string;
    name: string;
    avatar: string;
}

export { IMessage, IParticipant};