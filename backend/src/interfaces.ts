interface IParticipant {
    login: string;
    name: string;
    avatar: string;
}

interface IMessage {
    sender: IParticipant;
    text: string;
    selfMessage: boolean;
}

export { IParticipant, IMessage }