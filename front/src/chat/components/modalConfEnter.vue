<template>
    <div class="entry">
        <div class="entry-content">
            <div class="entry-content__caption">
                <div class="entry-content__caption-paragraph">Выберите беседу:</div>
                <select 
                    class="entry-input__select"
                    v-model="confName"
                    required
                >
                    <option 
                        v-for="(conference, key) in conferences" :key="key"
                        :value="conference"
                    >
                        {{ conference }}
                    </option>
                </select>
                <div class="entry-content__caption-paragraph">Придумайте логин:</div>
                <input 
                    type="text" 
                    class="entry-input__text"
                    v-model="login"
                    autocomplete="off" 
                    required
                />
            </div>
            <div class="entry-content__submit">
                <button class="entry-content__submit-btn" @click.prevent="modalClosed">
                    присоедениться
                </button>
                <button class="entry-content__submit-btn" @click.prevent="moveToCreation">
                    создать конфу
                </button>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";

@Component
export default class modalConfEnter extends Vue{

    @Prop({default: []}) conferences: string [];

    login: string ='';
    confName: string = '';

    modalClosed(): void {
        if(!this.login || !this.confName) return;
        this.$emit('entered', { login: this.login, confName: this.confName });
    }

    moveToCreation(): void {
        this.$emit('move-creation');
    }
}
</script>

<style lang="scss">

    .entry {
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

        &-content {
            display: flex;
            flex-direction: column;
            max-width: 400px;
            background-color: white;
            box-shadow: 2px 10px 10px 0px #888;

            &__caption {
                padding: 20px 60px 40px 60px;
                height: 70%;
                display: flex;
                flex-direction: column;
                align-items: center;

                &-header {
                    text-transform: uppercase;
                    font-weight: bold;
                }
                &-paragraph {
                    margin-top: 15px;
                    text-transform: uppercase;
                    line-height: 180%;
                }
            }

            &__submit {
                display: flex;
                flex-direction: column;
                height: 30%;
                background-color: #eee;
                padding: 15px 40px 20px 40px;

                &-btn {
                    margin-top: 10px;
                    width: 100%;
                    height: 50px;
                    border: none;
                    background-color: #89CFF0;
                    text-transform: uppercase;
                    font-weight: bold;
                    color: white;
                    outline: inherit;

                    &:hover {
                        background-color:#57A0D3;
                    }
                    &:active {
                        color: rgba(255,255,255, 0.5);
                    }
                }
            }
        }

        &-input{
            &__text{
                background-color: #eee;
                border : none;
                padding: 12px 7px;
                font-weight: bold;
                margin-top: 10px;
                width: 175px;
            }

            &__select{
                background-color: #eee;
                border : none;
                padding: 12px 7px;
                font-weight: bold;
                margin-top: 10px;
                width: 190px;
            }

            &:focus{
                outline: none;
            }
        }


    }

</style>
