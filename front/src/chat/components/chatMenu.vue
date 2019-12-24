<template>
    <div class="menu">
        <div class="menu__icon"/>
        <div class="menu__content">
            <span class="menu__content-header">Участники:</span>
            <div class=menu__content-participants>
                <div 
                    class="menu__content-participant"
                    v-for="(paricipant, key) in participants"  
                    :key="key"
                >
                    <img class="person-icon" :src="getAvatarUrl(paricipant)"/>
                    {{ paricipant.login }}
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { IParticipant } from '@/models/interfaces';
import { Vue, Component, Prop } from "vue-property-decorator";

@Component({})
export default class chatMenu extends Vue {
    @Prop() participants:  IParticipant [];

    getAvatarUrl(participant: IParticipant) {
        const img = participant.isCreator ? 'creator.png' : 'participant.jpg';
        return require('../../assets/'+ img);
    }
}

</script>

<style lang="scss">

    .menu {
        position: relative;

        &:hover {
            opacity: 1;

            .menu__icon {
                opacity: 1;
            }

            .menu__content {
                opacity: 1;
                visibility: visible;
                transform: translateY(0px);
            }
        }

        &__icon{
            height: 30px;
            width: 30px ;
            background: url("../../assets/menu@1X.png") no-repeat;
            opacity: 0.5;
            background-size: contain;
            background-position: center;

            &:active {
                opacity: 1;
            }
        }

        &__content {
            display: flex;
            flex-direction: column;
            position: absolute;
            width: 300px;
            height: 300px;
            top: 45px;
            right: -40px;
            background-color: #ffffff;   
            box-shadow: 3px 5px 10px rgba(35, 31, 32, 0.4);
            border-radius: 15px;
            visibility: hidden;
            opacity: 0;
            transition: all 0.3s ease;
            transform: translateY(20px);
            z-index: 1;

            &:before {
                position: absolute;
                content: "";
                top: -10px;
                right: 45px;
                width: 0;
                height: 0;
                border-bottom: 10px solid #ffffff;
                border-left: 10px solid transparent;
                border-right: 10px solid transparent;
            }     

            &-participants{
                overflow-y: auto;
            }

            &-participant{
                display: flex;
                padding: 25px 40px;;
                position: relative;

                .person-icon{
                    position: absolute;
                    top: 15px;
                    left: 5px;
                    width: 35px;
                    height: 35px;;
                }
            }

            &-header{
                padding: 15px;
                text-align: start;
                border-bottom:  #bebebe solid 1px;
            }
        }
    }
</style>
