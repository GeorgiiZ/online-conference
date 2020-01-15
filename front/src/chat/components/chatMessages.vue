<template>
    <div class="messages" ref="el">
        <div class="message"
             v-for="(message, index) in messages" :key="index"
             :class="[
                { 'message_self': message.selfMessage },
                { 'message_outer': !message.selfMessage },
                { 'message_repeated':  getIsRepeated(index) }
             ]"
        >
            <div class="message__content">
                <div class="message__content-login">{{ message.sender.login }}</div>
                <div class="message__content-string">
                    {{ message.text }}
                </div>
            </div>
            <img class="message__avatar" :src="getAvatarUrl(message.sender.avatar)"/>
        </div>
    </div>
</template>

<script lang="ts">
    import {Vue, Component, Prop, Watch} from "vue-property-decorator";
import { IMessage } from "@/models/interfaces";


@Component({
})
export default class chatMessages extends Vue {
    @Prop({ default: [] }) messages: IMessage [] | undefined;

    getIsRepeated(index: number): boolean {
        if(index === 0) { return false }
        return (<any>this.messages)[index].sender.login === (<any>this.messages)[index-1].sender.login
    }

    getAvatarUrl(avatar: string) {
        const img = avatar? avatar : 'default-avatar.jpg';
        return require('../../assets/'+ img);
    }

    scrollToEnd() {
        let scrollContainer = this.$refs.el;
        let hiddenElement = (<any>scrollContainer).lastChild;
        hiddenElement && hiddenElement.scrollIntoView({ block: "end", behavior: "auto" });
    }

    updated(){
        this.scrollToEnd();
    }
}
</script>

<style lang="scss">

.messages {
    width: 100%;
    height: 100%;
    overflow-y: auto;
}

.message {
    padding: 15px 15px 10px 15px;
    display: flex;
    align-items: flex-start;

    &__content {
        display: flex;
        flex-direction: column;

        &-string {
            position: relative;
            margin-top: 5px;
            padding: 20px;
            border-radius: 15px;
        }

        &-login{
            font-weight: bold;
            color: #BEBEBE;
        }
    }
    

    &__avatar{
        border-radius: 50%;
        width: 55px;
        height: 55px;
    }

    &_self{
        justify-content: flex-end;

        .message {
            &__content {
                align-items: flex-end;
                order: 1;
                margin-right: 20px; 

                &-string{
                    background-color: #89CFF0;
                    color: white;
                    box-shadow: -5px 5px 10px  #BEBEBE;
                }

                &-login{
                    position: relative;

                    &::after {
                        z-index: 1;
                        position: absolute;
                        content: "";
                        top: calc(50% + 35px);
                        right: -15px;
                        width: 0;
                        height: 0;
                        border-top: 3px solid transparent;
                        border-bottom: 15px solid transparent;
                        border-left:   15px solid #89CFF0;
                    }
                }
            }
            
            &__avatar{
                order: 2;
            }
        }
    }

    &_outer{
        justify-content: flex-start;

        .message {
            &__content {
                align-items: flex-start;
                order: 2; 
                margin-left: 20px; 
                
                &-string{
                    background-color: white;
                    color: grey;
                    box-shadow: 5px 5px 20px  #BEBEBE;
                }

                &-login {
                    position: relative;

                    &::after {
                        z-index: 1;
                        position: absolute;
                        content: "";
                        top: calc(50% + 30px);
                        left: -15px;
                        width: 0;
                        height: 0;
                        border-top: 3px solid transparent;
                        border-bottom: 15px solid transparent;
                        border-right:   15px solid white;
                    }
                }
            }
            
            &__avatar{
                order: 1; 
            }
        }
    }

    &_repeated{
        padding: 0 15px 10px 15px;

        .message {
            &__content-login {
                display: none;
            }

            &__avatar {
                visibility: hidden;
            }

            &-string {

            }
        }
    }
}

</style>
