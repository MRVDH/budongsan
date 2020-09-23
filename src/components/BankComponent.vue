<template>
    <div class="row" v-if="bankOpen">
        <div class="col-4">
            <b-card title="Bank" class="lift">
                <b-row>
                    <b-col cols="9">
                        <b-form-group
                            id="loan-range-set"
                            label-cols-sm="4"
                            label-cols-lg="4"
                            :description="`Amount: ${formatCurrency(amountToLoan)} | Monthly interest: ${formatCurrency(interest)}`"
                            label="Open a new loan"
                            label-for="loan-range"
                            >
                            <b-form-input id="loan-range" v-model="amountToLoan" type="range" min="100" :max="maxAmountToLoan" step="100"></b-form-input>
                        </b-form-group>
                    </b-col>
                    <b-col>
                        <span id="take-loan-button" class="d-inline-block" tabindex="0" style="float: right">
                            <b-button
                                id="take-loan-button"
                                class="button-right"
                                v-on:click="takeLoan()"
                                variant="success"
                                v-bind:class="{ 'disabled': maxLoansReached }"
                                :disabled="maxLoansReached"
                            >Take loan</b-button>
                        </span>
                        <b-tooltip v-if="maxLoansReached" target="take-loan-button">
                            Max amount of loans for your current level reached
                        </b-tooltip>
                    </b-col>
                </b-row>

                <b-row v-if="selectedLoan">
                    <b-col cols="9">
                        <b-form-group
                            id="pay-off-set"
                            label-cols-sm="4"
                            label-cols-lg="4"
                            :description="`Amount: ${formatCurrency(amountToPayOff)} | Max: ${formatCurrency(amountPayable)}`"
                            label="Pay off this loan"
                            label-for="pay-off-input"
                        >
                            <b-form-input id="pay-off-input" v-model="amountToPayOff" type="range" min="1" :max="amountPayable" step="1"></b-form-input>
                        </b-form-group>
                    </b-col>
                    <b-col>
                        <b-button class="button-right" v-on:click="payOffLoan()" variant="success">Pay off</b-button>
                    </b-col>
                </b-row>

                <b-card-text v-if="!loans.length">No open loans</b-card-text>
                <table v-else class="table">
                    <thead>
                        <tr>
                            <th scope="col">Amount</th>
                            <th scope="col">Payed off</th>
                            <th scope="col">Monthly interest</th>
                            <th scope="col">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="loan in loans" :key="loan.id">
                            <td>{{ formatCurrency(loan.amount) }}</td>
                            <td>{{ formatCurrency(loan.payedBack) }}</td>
                            <td>{{ formatCurrency(loan.interest) }}</td>
                            <td><b-button variant="success" v-on:click="selectedLoan = loan">Pay off</b-button></td>
                        </tr>
                    </tbody>
                </table>
            </b-card>
        </div>
    </div>
</template>

<script>
import { formatCurrency, uuidv4 } from '../services/helperService';
import { ADD_LOAN, PAY_OFF_LOAN, ADD_MONEY } from '../store/mutationTypes';

export default {
    name: 'BankComponent',
    data () {
        return {
            amountToLoan: 0,
            interest: 0,
            selectedLoan: null,
            amountToPayOff: 0,
            amountPayable: 0,
            maxAmountToLoan: 5000
        };
    },
    mounted () {
        this.setBaseLoan();
        this.setBasePayOff();
        this.setMaxLoan();
    },
    computed: {
        bankOpen () {
            return this.$store.state.bankOpen;
        },
        loans () {
            return this.$store.state.loans;
        },
        money () {
            return this.$store.state.money;
        },
        level () {
            return this.$store.state.level;
        },
        maxLoansReached () {
            return this.loans.length >= this.level + 1;
        }
    },
    watch: {
        amountToLoan (amount) {
            this.interest = (amount * 3.5) / 100
        },
        money (current) {
            this.amountPayable = this.selectedLoan ? (this.selectedLoan.amount - this.selectedLoan.payedBack > current ? current : this.selectedLoan.amount - this.selectedLoan.payedBack) : 0;
        },
        selectedLoan (current) {
            this.amountPayable = current ? (current.amount - current.payedBack > this.money ? this.money : current.amount - current.payedBack) : 0;
        },
        level () {
            this.setMaxLoan();
        }
    },
    methods: {
        formatCurrency,
        setBaseLoan () {
            this.amountToLoan = 100;
            this.interest = 3.5;
        },
        setBasePayOff () {
            this.amountToPayOff = 1;
        },
        setMaxLoan () {
            this.maxAmountToLoan = this.level * 5000
        },
        takeLoan () {
            this.$store.dispatch(ADD_LOAN, {
                id: uuidv4(),
                amount: this.amountToLoan,
                payedBack: 0,
                interest: this.interest
            });

            this.$store.dispatch(ADD_MONEY, parseInt(this.amountToLoan));

            this.setBaseLoan();
        },
        payOffLoan () {
            this.$store.dispatch(PAY_OFF_LOAN, {
                id: this.selectedLoan.id,
                amount: this.amountToPayOff
            });

            this.$store.dispatch(ADD_MONEY, -this.amountToPayOff);
            this.selectedLoan = 0;
            this.setBasePayOff();
        }
    }
};
</script>

<style scoped>
.button-right {
    margin-left: auto;
    display: block;
}
</style>
