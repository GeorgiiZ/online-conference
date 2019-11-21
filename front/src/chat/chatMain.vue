<template>
    <div class="chat">
        <div class="chat__header">
            <div
                class="chat__header-chatname"
            >
                {{ confName }}
                <div class="chat__header-online"/>
            </div>
            <chatMenu 
                class="chat__header-menu"
                :participants="participants"
            />
        </div>
        <div class="chat__messages">
            <chatMessage
                v-for="(message, key) in messages" :key="key"
                :message="message"
            />
        </div>
        <div class="chat__send">
            <input 
                v-model="inputMessage"
                type="text" 
                class="chat__send-input" 
                placeholder="Type your message..."
            />
            <button class="chat__send-button" @click.prevent="sendMessage(inputMessage)"/>
        </div>
        <modalConfCreation 
            v-if="isCreationOpen"
            @conf-created="onConfCreated"
        />
        <modalConfEnter 
            v-if="isEnterOpen"
            :conferences="conferences"
            @entered="onEntered"
        />
    </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import chatMessage from "@/chat/components/chatMessage.vue";
import chatMenu from "@/chat/components/chatMenu.vue";
import modalConfCreation from "@/chat/components/modalConfCreation.vue";
import modalConfEnter from "@/chat/components/modalConfEnter.vue";

import { IMessage, IParticipant } from '@/models/interfaces';
import { SocketService } from "@/services/SocketService";

@Component({
    components: {
        chatMessage,
        chatMenu,
        modalConfCreation,
        modalConfEnter
    }
})
export default class chatMain extends Vue {
    isCreationOpen: boolean = false;
    isEnterOpen: boolean = false;
    conferences: string [] = [];
    inputMessage: string = '';
    socketService: SocketService | null = null;
    confName: string = '';
    messages: IMessage [] = [];
    participants: IParticipant [] = [];

    sendMessage(message: string){
        this.socketService && this.socketService.sendMessage(message);
        this.inputMessage = '';
    }

    async onConfCreated(creadentials: any){
        const { login, confName } = creadentials;
        const participant = <IParticipant> { login }
        this.confName = await this.socketService.joinConf(participant, confName);
        this.isCreationOpen = false;
    }

    async onEntered(creadentials: any){
        const { login, confName } = creadentials;
        const participant = <IParticipant> { login };
        this.confName = await this.socketService.joinConf(participant, confName);
        this.isEnterOpen = false;
    }

    onDisconnect(){
        console.log("disconnected")
        // window.location.reload(false);
    }

    openModal(){
        if(this.conferences.length){
            this.isEnterOpen = true;
        } else {
            this.isCreationOpen = true; 
        }
    }

    created(){
        this.socketService = new SocketService(this.messages, this.participants);
        this.socketService.disconnectCallBack = this.onDisconnect;
        this.socketService.getConferences().then( res => {
            this.conferences = res;
            this.openModal();
        });
    }
}

</script>

<style lang="scss">

.chat {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    background-color: whitesmoke;
    padding: 30px 40px;

    &__header{
        display: flex;
        align-items: center;
        padding: 25px 0;
        border-bottom: 2px solid gainsboro;

        &-chatname{
            display: flex;
            align-items: center;
            font-weight: bold;
            font-size: 18px;
        }

        &-online{
            margin-left: 15px; 
            height: 12px;
            width: 12px ;
            background: url("../assets/online@1X.png") no-repeat;
            background-size: contain;
            background-position: center;
            opacity: 0.5;
        }

        &-menu{
            margin-left: auto; 
        }      
    }

    &__messages {
        display: flex;
        flex-direction: column;
        width: 100%;
        height: 100%;
        //margin: 25px 0;
        overflow-y: auto;
    }

    &__send{
        // position: fixed;
        // bottom: 10px;
        margin-top: auto;
        display: flex;
        align-items: center;
        position: relative;
        background-color: white;
        box-shadow: 10px 5px 20px  #BEBEBE;

        &-input {
            border : none;
            padding: 35px;
            font-size: 16px;
            background-color: white;
            flex: 1;

            &:focus {
                outline: none;
            }
        }

        &-button{
            border : none;
            outline: inherit;
            border-radius: 50%;
            width: 55px;
            height: 55px;
            margin-right: 20px;
            background: url("../assets/Layer 13@1X.png") no-repeat;
            background-position: center;
            background-size: 2rem;
            background-color: #89CFF0;
            box-shadow:  5px 5px 20px  #BEBEBE;

            &:hover{
                cursor: pointer;
            }

            &:active{
                opacity: 0.7;
            }
        }
    }
}

</style>
