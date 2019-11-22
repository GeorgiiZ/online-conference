<template>
    <div class="entry">
        <div class="entry-content">
            <div class="entry-content__caption">
                <div class="entry-content__caption-paragraph">Задайте название:</div>
                <input 
                    type="text" 
                    class="entry-input__text"
                    v-model="confName" 
                    autocomplete="off" 
                    required
                />
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
                    создать
                </button>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";

@Component
export default class modalConfCreation extends Vue{

    login: string ='';
    confName: string = '';

    modalClosed(): void {
        if(!this.login || !this.confName) return;
        this.$emit('conf-created', { login: this.login, confName: this.confName });
    }
}
</script>

<style lang="scss">

</style>
