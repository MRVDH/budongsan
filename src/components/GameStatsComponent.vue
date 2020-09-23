<template>
    <div class="row">
        <div class="col-4">
            <b-card class="lift">
                <b-card-text class="flex-items">
                    <div class="flex-item">
                        <b-dropdown size="sm" variant="light" toggle-class="no-padding">
                            <template v-slot:button-content>
                                <b-icon icon="justify"></b-icon>
                            </template>
                            <b-dropdown-item v-on:click="openExperienceWindow()">Experience</b-dropdown-item>
                            <b-dropdown-item v-on:click="openListOfBuildings()">List of buildings</b-dropdown-item>
                            <b-dropdown-item v-on:click="openBank()">Bank</b-dropdown-item>
                        </b-dropdown>
                    </div>

                    <div class="flex-item">
                        <b-icon icon="cash-stack"></b-icon>
                        <span class="font-weight-bold" v-bind:class="{ 'text-success': money >= 0, 'text-danger': money < 0 }">{{ moneyOutput }}</span>
                    </div>

                    <div class="flex-item">
                        <b-icon icon="person" class="clickable" v-on:click="openExperienceWindow()"></b-icon>
                        <span>{{ level }}</span>
                    </div>

                    <div class="flex-item">
                        <b-icon icon="door-open" class="clickable" v-on:click="openListOfBuildings()"></b-icon>
                        <span>{{ rentingFeatures.length }}</span>
                    </div>

                    <div class="flex-item">
                        <b-icon icon="building" class="clickable" v-on:click="openListOfBuildings()"></b-icon>
                        <span>{{ ownedFeatures.length }}</span>
                    </div>

                    <div class="flex-item">
                        <b-icon icon="clock"></b-icon>
                        <span>{{ timeOutput }}</span>
                    </div>
                </b-card-text>
            </b-card>
        </div>
    </div>
</template>

<script>
import { formatCurrency } from '../services/helperService';
import { OPEN_LIST_OF_BUILDINGS, OPEN_BANK, OPEN_EXPERIENCE, ADD_MONEY, SET_LAST_PAYOUT_DATE } from '../store/mutationTypes';

export default {
    name: 'GameStatsComponent',
    data () {
        return {
            timeOutput: ""
        };
    },
    mounted () {
        this.getTime();
        setInterval(this.getTime, 100);
        setInterval(this.incomeLoop, 1000);
    },
    computed: {
        money () {
            return this.$store.state.money;
        },
        moneyOutput () {
            return formatCurrency(this.money);
        },
        rentingFeatures () {
            return this.$store.state.rentingFeatures;
        },
        ownedFeatures () {
            return this.$store.state.ownedFeatures;
        },
        level () {
            return this.$store.state.level;
        }
    },
    watch: {
        level (newLevel, oldLevel) {
            if (newLevel != oldLevel) {
                this.$bvToast.toast(`Level up!`, {
                    noCloseButton: true,
                    toaster: `b-toaster-bottom-left`,
                    variant: `success`,
                    solid: true
                });
            }
        }
    },
    methods: {
        getTime () {
            let d = new Date();
            this.timeOutput = `${d.toTimeString().split(` GMT`)[0]} ${d.toDateString()}`;
        },
        incomeLoop () {
            const now = new Date();
            var timeDiffHours = (now - new Date(this.$store.state.lastPayoutDate)) / (1000 /*second*/ * 60 /*minute*/ * 60 /*hour*/)

            timeDiffHours = Math.floor(timeDiffHours);
            
            // Timecheck, if a certain time hasn't passed then don't process income.
            if (timeDiffHours < 1) {
                return;
            }
            // mostly debug purposes
            // if (timeDiffHours < 1) {
            //     timeDiffHours = 1;
            // }

            this.$store.dispatch(SET_LAST_PAYOUT_DATE, now);
            this.lastPayout = now;

            let moneyToAdd = 0;
            let incomeFromSubletting = 0;
            let incomeFromRenting = 0;
            let interest = 0;

            for (const feature of this.$store.state.rentingFeatures) {
                moneyToAdd += feature.incomeRenting;
                incomeFromSubletting += feature.incomeRenting
            }
            for (const feature of this.$store.state.ownedFeatures) {
                moneyToAdd += feature.incomeOwned;
                incomeFromRenting += feature.incomeOwned
            }
            for (const loan of this.$store.state.loans) {
                moneyToAdd -= loan.interest;
                interest += loan.interest;
            }

            // Nothing at all, usually at the start of the game.
            if (!incomeFromSubletting && !incomeFromRenting && !interest) {
                this.$bvToast.toast(`No rent received this month.`, {
                    noCloseButton: true,
                    toaster: `b-toaster-bottom-left`,
                    variant: `success`,
                    solid: true
                });

                return;
            }
            
            // Income exactly equal to costs.
            if ((incomeFromSubletting + incomeFromRenting) === interest) {
                this.$bvToast.toast(`Income equal to costs.`, {
                    noCloseButton: true,
                    toaster: `b-toaster-bottom-left`,
                    variant: `warning`,
                    solid: true
                });

                return;
            }

            moneyToAdd *= timeDiffHours;

            // costs higher than income, problematic
            if (moneyToAdd < 0) {
                this.$store.dispatch(ADD_MONEY, moneyToAdd);

                this.$bvToast.toast(`Costs are higher than income. ${formatCurrency(moneyToAdd * -1)} deducted.`, {
                    noCloseButton: true,
                    toaster: `b-toaster-bottom-left`,
                    variant: `warning`,
                    solid: true
                });

                return;
            }

            this.$store.dispatch(ADD_MONEY, moneyToAdd);

            this.$bvToast.toast(`Rental income of ${formatCurrency(moneyToAdd)} received.`, {
                noCloseButton: true,
                toaster: `b-toaster-bottom-left`,
                variant: `success`,
                solid: true
            });
        },
        openListOfBuildings () {
            this.$store.dispatch(OPEN_LIST_OF_BUILDINGS, !this.$store.state.listOfBuildingsOpen);
        },
        openBank () {
            this.$store.dispatch(OPEN_BANK, !this.$store.state.bankOpen);
        },
        openExperienceWindow () {
            this.$store.dispatch(OPEN_EXPERIENCE, !this.$store.state.experienceOpen);
        }
    }
};
</script>

<style scoped>
.card-body {
    padding: 5px 10px;
    user-select: none;
}
.row {
    padding-bottom: 15px;
}
.row .col-4 {
    z-index: 3;
}
.flex-items {
    display: flex;
    align-content: center;
    justify-content: flex-start
}
.flex-item:not(:last-child) {
    margin-right: 10px;
}
.flex-item:last-child {
    margin-left: auto;
}
svg {
    margin-right: 5px;
}
.clickable:hover {
    cursor: pointer;
    opacity: 0.7;
}
.dropdown {
    vertical-align: baseline;
}
</style>
