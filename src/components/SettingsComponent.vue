<template>
    <b-row v-if="settingsOpen">
        <b-col lg="12" xl="6">
            <b-card title="Settings" class="lift">
                <b-card-text>
                    Game Speed (payout interval): <b-form-select id="interval-select" v-model="selectedOption" :options="options" size="sm" class="mt-3"></b-form-select><br/>
                    Delete game data: <b-button size="sm" variant="danger" v-on:click="wipeSave()">Hard Reset</b-button>
                </b-card-text>
            </b-card>
        </b-col>
    </b-row>
</template>

<script>
import { SET_GAME_SPEED } from '../store/mutationTypes';

export default {
    name: 'SettingsComponent',
    data () {
        return {
            selectedOption: 0,
            options: [
                { value: 0, text: "every minute" },
                { value: 1, text: "every hour" },
                { value: 2, text: "every day" },
                { value: 3, text: "every week" },
            ]
        };
    },
    mounted () {
        this.selectedOption = this.gameSpeed;
    },
    computed: {
        settingsOpen () {
            return this.$store.state.settingsOpen;
        },
        gameSpeed () {
            return this.$store.state.gameSpeed;
        }
    },
    watch: {
        selectedOption () {
            this.$store.dispatch(SET_GAME_SPEED, this.selectedOption);
        }
    },
    methods: {
        wipeSave () {
            if (!confirm("Are you sure?")) {
                return;
            }

            localStorage.removeItem("vuex");
            location.reload();
        }
    }
};
</script>

<style scoped>
#interval-select {
    margin: 0 !important;
    display: inline-block;
    width: inherit;
}
</style>
