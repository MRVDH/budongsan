<template>
    <b-row v-if="experienceOpen">
        <b-col lg="12" xl="6">
            <b-card class="lift">
                <b-card-title>Experience <b-badge pill variant="success">{{ level }}</b-badge></b-card-title>
                <b-card-text>Progress: {{ experience.toFixed(0) }}/{{ nextExperience }}xp</b-card-text>
                <b-progress :value="experience" :max="nextExperience" show-value variant="success" height="24px"></b-progress>
            </b-card>
        </b-col>
    </b-row>
</template>

<script>
import { getExperienceFromLevel } from '../services/helperService';

export default {
    name: 'BankComponent',
    data () {
        return {
            nextExperience: 0,
            nextLevel: 0
        };
    },
    mounted () {
        this.setNextLevelProperties(this.level);
    },
    computed: {
        experienceOpen () {
            return this.$store.state.experienceOpen;
        },
        experience () {
            return this.$store.state.experience;
        },
        level () {
            return this.$store.state.level;
        }
    },
    watch: {
        level (level) {
            this.setNextLevelProperties(level);
        }
    },
    methods: {
        setNextLevelProperties (level) {
            this.nextLevel = level + 1;
            this.nextExperience = getExperienceFromLevel(this.nextLevel);
        }
    }
};
</script>

<style scoped>

</style>
