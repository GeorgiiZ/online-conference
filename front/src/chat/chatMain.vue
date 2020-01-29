<template>
    <form
         @submit.prevent="sendMessage"
         class="chat"
    >
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
            <chatMessages
                :messages="messages"
            />
        </div>
        <div class="chat__send">
            <input
                v-model="inputMessage"
                type="text"
                class="chat__send-input"
                placeholder="Type your message..."
            />
            <button class="chat__send-button"
                @click.prevent="sendMessage(inputMessage)"
            />
        </div>
        <modalConfCreation
                v-if="isCreationOpen"
                @conf-created="onConfCreation"
        />
        <modalConfEnter
                v-if="isEnterOpen"
                :conferences="conferences"
                @entered="onEntered"
                @move-creation="onCreationOpen"
        />
        <div v-if="isLoading" class="loading">
            <div  class="loading__circle"></div>
        </div>
    </form>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import chatMessages from "@/chat/components/chatMessages.vue";
import chatMenu from "@/chat/components/chatMenu.vue";
import modalConfCreation from "@/chat/components/modalConfCreation.vue";
import modalConfEnter from "@/chat/components/modalConfEnter.vue";

import { IMessage, IParticipant } from '@/models/interfaces';
import { SocketService } from "@/services/SocketService";

@Component({
    components: {
        chatMessages,
        chatMenu,
        modalConfCreation,
        modalConfEnter
    }
})
export default class chatMain extends Vue {
    isCreationOpen: boolean = false;
    isEnterOpen: boolean = false;
    isLoading: boolean = true;

    conferences: string [] = [];
    inputMessage: string = '';
    socketService: SocketService | null = null;
    confName: string = '';
    messages: IMessage [] = [];
    participants: IParticipant [] = [];

    sendMessage(message: string) {
        this.socketService && this.socketService.sendMessage(message);
        this.inputMessage = '';
    }

    async onConfCreation(creadentials: any) {
        this.isCreationOpen = false;
        this.isLoading = true;
        const { login, confName } = creadentials;
        const participant = <IParticipant> { login }
        this.confName = await (<any> this.socketService).createConference(participant, confName);
        this.isLoading = false;
    }

    async onEntered(creadentials: any) {
        this.isEnterOpen = false;
        this.isLoading = true;
        const { login, confName } = creadentials;
        const participant = <IParticipant> { login };
        this.confName = await (<any> this.socketService).joinConf(participant, confName);
        this.isLoading = false;
    }

    onCreationOpen(){
        this.isEnterOpen = false;
        this.isCreationOpen = true;
    }

    onDisconnect() {
        console.log("disconnected");
        window.location.reload(false);
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
            this.isLoading = false;
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
                z-index: 2;
            }
        }

        &__messages {
            overflow-y: hidden;
        }

        &__send{
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

    .loading {
        display: flex;
        justify-content: center;
        align-items: center;
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 2;
        background-color: rgba(0,0,0,0.4);

        &__circle {
            width: 2rem;
            height: 2rem;
            border-radius: 50%;
            border: 0.3rem solid rgba(#89CFF0, 0.3);
            border-top-color: #89CFF0;
            animation: 1.5s spin infinite linear;
        }
    }


    @keyframes spin {
        to {
            transform: rotate(360deg);
        }
    }

</style>
