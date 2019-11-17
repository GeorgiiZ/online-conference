interface IMessage {
    sender: IParticipant;
    text: string;
    selfMessage: boolean;
}

interface IParticipant {
    login: string;
    isCreator: boolean;
    avatar: string;
}

export { IMessage, IParticipant};