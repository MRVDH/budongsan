import Vue from 'vue';
import Vuex from 'vuex';
import VuexPersistence from 'vuex-persist';
import * as mt from './mutationTypes';
import { getLevelFromExperience } from '../services/helperService';

Vue.use(Vuex);

const vuexLocal = new VuexPersistence({
    storage: window.localStorage
});

export default new Vuex.Store({
    state: {
        money: 500,
        experience: 0,
        level: 1,
        selectedFeature: null,
        rentingFeatures: [],
        ownedFeatures: [],
        listOfBuildingsOpen: false,
        bankOpen: false,
        experienceOpen: false,
        lastPayoutDate: new Date(),
        loans: []
    },
    mutations: {
        [mt.SELECT_FEATURE] (state, feature) {
            state.selectedFeature = feature;

            if (feature) {
                state.bankOpen = false;
                state.listOfBuildingsOpen = false;
                state.experienceOpen = false;
            }
        },
        [mt.ADD_TO_RENTING_FEATURES] (state, feature) {
            state.rentingFeatures.push(feature);
        },
        [mt.REMOVE_FROM_RENTING_FEATURES] (state, id) {
            state.rentingFeatures = state.rentingFeatures.filter(x => x.id !== id);
        },
        [mt.ADD_TO_OWNED_FEATURES] (state, feature) {
            state.ownedFeatures.push(feature);
        },
        [mt.ADD_MONEY] (state, amount) {
            state.money += amount;
        },
        [mt.OPEN_LIST_OF_BUILDINGS] (state, openIt) {
            state.listOfBuildingsOpen = openIt;

            if (openIt) {
                state.bankOpen = false;
                state.experienceOpen = false;
                state.selectedFeature = null;
            }
        },
        [mt.SET_LAST_PAYOUT_DATE] (state, lastPayoutDate) {
            state.lastPayoutDate = lastPayoutDate;
        },
        [mt.OPEN_BANK] (state, openIt) {
            state.bankOpen = openIt;

            if (openIt) {
                state.listOfBuildingsOpen = false;
                state.experienceOpen = false;
                state.selectedFeature = null;
            }
        },
        [mt.ADD_LOAN] (state, loan) {
            state.loans.push(loan);
        },
        [mt.PAY_OFF_LOAN] (state, data) {
            let loanToPayOff = state.loans.find(x => x.id === data.id);
            
            loanToPayOff.payedBack += parseInt(data.amount);

            if (parseInt(loanToPayOff.amount) === loanToPayOff.payedBack) {
                state.loans = state.loans.filter(x => x.id !== data.id);
            } else {
                const index = state.loans.map(loan => loan.id).indexOf(loanToPayOff.id);
                state.loans.splice(index, 1, loanToPayOff);
            }
        },
        [mt.OPEN_EXPERIENCE] (state, openIt) {
            state.experienceOpen = openIt;

            if (openIt) {
                state.listOfBuildingsOpen = false;
                state.bankOpen = false;
                state.selectedFeature = null;
            }
        },
        [mt.ADD_EXPERIENCE] (state, experience) {
            state.experience += experience;
            state.level = getLevelFromExperience(state.experience);
        }
    },
    actions: {
        [mt.SELECT_FEATURE] ({ commit }, feature) {
            commit(mt.SELECT_FEATURE, feature);
        },
        [mt.ADD_TO_RENTING_FEATURES] ({ commit }, feature) {
            commit(mt.ADD_TO_RENTING_FEATURES, feature);
        },
        [mt.REMOVE_FROM_RENTING_FEATURES] ({ commit }, id) {
            commit(mt.REMOVE_FROM_RENTING_FEATURES, id);
        },
        [mt.ADD_TO_OWNED_FEATURES] ({ commit }, feature) {
            commit(mt.ADD_TO_OWNED_FEATURES, feature);
        },
        [mt.ADD_MONEY] ({ commit }, amount) {
            commit(mt.ADD_MONEY, amount);
        },
        [mt.OPEN_LIST_OF_BUILDINGS] ({ commit }, openIt) {
            commit(mt.OPEN_LIST_OF_BUILDINGS, openIt);
        },
        [mt.SET_LAST_PAYOUT_DATE] ({ commit }, lastPayoutDate) {
            commit(mt.SET_LAST_PAYOUT_DATE, lastPayoutDate);
        },
        [mt.OPEN_BANK] ({ commit }, openIt) {
            commit(mt.OPEN_BANK, openIt);
        },
        [mt.ADD_LOAN] ({ commit }, loan) {
            commit(mt.ADD_LOAN, loan);
        },
        [mt.PAY_OFF_LOAN] ({ commit }, data) {
            commit(mt.PAY_OFF_LOAN, data);
        },
        [mt.OPEN_EXPERIENCE] ({ commit }, openIt) {
            commit(mt.OPEN_EXPERIENCE, openIt);
        },
        [mt.ADD_EXPERIENCE] ({ commit }, experience) {
            commit(mt.ADD_EXPERIENCE, experience);
        }
    },
    plugins: [vuexLocal.plugin]
});
