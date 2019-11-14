<template>
    <div class="entry">
        <div class="entry-content">
            <div class="entry-content__caption">
                <div class="entry-content__caption-paragraph">Придумайте логин:</div>
                <input 
                    type="text" 
                    class="entry-input" 
                    v-model="login" 
                    autocomplete="off" 
                    required
                />
            </div>
            <div class="entry-content__submit">
                <button class="entry-content__submit-btn" @click.prevent="modalClosed">
                    присоедениться
                </button>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";

@Component
export default class modalEntry extends Vue{

    login: string ='';

    modalClosed(): void {
        if(!this.login) return;
        this.$emit('entered', { login: this.login });
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
        min-width: 300px;
        background-color: white;
        box-shadow: 2px 10px 10px 0px #888;

        &__caption {
            padding: 50px 20px;
            height: 70%;
            display: flex;
            flex-direction: column;
            align-items: center;

            &-header {
                text-transform: uppercase;
                font-weight: bold;
            }
            &-paragraph {
                text-transform: uppercase;
                line-height: 180%;
            }
        }        
        
        &__submit {
            height: 30%;
            background-color: #eee;
            padding: 40px 60px ;

            &-btn {
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
        background-color: #eee;
        border : none;
        padding: 10px;
        font-weight: bold;
        margin-top: 15px;

        &:focus{
            outline: none;
        }
    }
}
</style>