<template>
    <div class="entry">
        <div class="entry-content">
            <div class="entry-content__caption">
                <div class="entry-content__caption-paragraph">Выберите беседу:</div>
                <select 
                    class="entry-input" 
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
import { Vue, Component, Prop } from "vue-property-decorator";

@Component
export default class modalConfEnter extends Vue{

    @Prop({default: []}) conferences: string [];

    login: string ='';
    confName: string = '';

    modalClosed(): void {
        if(!this.login) return;
        this.$emit('entered', { login: this.login, confName: this.confName });
    }
}
</script>

<style lang="scss">

</style>
