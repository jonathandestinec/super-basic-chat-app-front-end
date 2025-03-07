declare type Me = {
    id: string;
    name: string;
    token: string;
};

declare type Room = {
    _id: string;
    members: User[];
    messages: Message[];
}

declare type User = {
    _id: string;
    name: string;
}

declare type Message = {
    _id: string;
    chatId: string;
    senderId: string;
    text: string;
}

declare type Chat = {
    _id: string;
    members: User[];
    messages: Message[];
};
