<template>
    <div class="text-white text-center font-bold p-4 rounded mb-4" v-if="reg_show_alert" :class="reg_alert_variant">
        {{ reg_alert_msg }}
    </div>
    <VeeForm :validation-schema="schema" @submit="register" :initial-values="userData">
        <!-- Name -->
        <div class="mb-3">
            <label class="inline-block mb-2">Name</label>
            <VeeField name="name" type="text"
                class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
                placeholder="Enter Name" />
            <ErrorMessage class="text-red-600" name="name" />
        </div>
        <!-- Email -->
        <div class="mb-3">
            <label class="inline-block mb-2">Email</label>
            <VeeField name="email" type="email"
                class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
                placeholder="Enter Email" />
            <ErrorMessage class="text-red-600" name="email" />
        </div>
        <!-- Age -->
        <div class="mb-3">
            <label class="inline-block mb-2">Age</label>
            <VeeField name="age" type="number"
                class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded" />
            <ErrorMessage class="text-red-600" name="age" />

        </div>
        <!-- Password -->
        <div class="mb-3">
            <label class="inline-block mb-2">Password</label>
            <VeeField name="password" :bails="false" v-slot="{ field }">
                <input type="password"
                    class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
                    placeholder="Password" v-bind="field" />
            </VeeField>
            <ErrorMessage class="text-red-600" name="password" />
        </div>
        <!-- Confirm Password -->
        <div class="mb-3">
            <label class="inline-block mb-2">Confirm Password</label>
            <VeeField name="confirm_password" type="password"
                class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
                placeholder="Confirm Password" />
            <ErrorMessage class="text-red-600" name="confirm_password" />

        </div>
        <!-- Country -->
        <div class="mb-3">
            <label class="inline-block mb-2">Country</label>
            <VeeField name="country" as="select"
                class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded">
                <option value="The Netherlands">The Netherlands</option>
                <option value="Germany">Germany</option>
                <option value="Mexico">Mexico</option>
                <option value="USA">USA</option>
            </VeeField>
            <ErrorMessage class="text-red-600" name="country" />
        </div>
        <!-- TOS -->
        <div class="mb-3 pl-6">
            <VeeField name="tos" type="checkbox" class="w-4 h-4 float-left -ml-6 mt-1 rounded" value="1" />
            <label class="inline-block">Accept terms of service</label>
            <ErrorMessage class="text-red-600 block" name="tos" />
        </div>
        <button type="submit"
            class="block w-full bg-purple-600 text-white py-1.5 px-3 rounded transition hover:bg-purple-700"
            :disabled="reg_in_submission">
            Submit
        </button>
    </VeeForm>
</template>

<script>
import { createUser, addUser } from "../includes/firebase"
import { useUserStore } from '@/stores/user'
import { mapWritableState } from 'pinia';

export default {
    name: "RegisterForm",
    computed: {
        ...mapWritableState(useUserStore, ["isLoggedIn"])
    },
    data() {
        return {
            schema: {
                name: 'required',
                email: 'required|email',
                age: 'required|numeric|min_value:16|max_value:100',
                password: 'required|min:6|max:100|excluded:passwor',
                confirm_password: 'required|confirmed:@password',
                country: 'required|country_excluded:USA',
                tos: 'tos',
            },
            userData: {
                country: 'The Netherlands'
            },
            reg_in_submission: false,
            reg_show_alert: false,
            reg_alert_variant: "bg-blue-500",
            reg_alert_msg: "Please wait! Your account is being created. :)",
        }
    },
    methods: {
        handleError() {
            this.reg_in_submission = false;
            this.reg_show_alert = true;
            this.reg_alert_variant = "bg-red-500";
            this.reg_alert_msg = "Unexpected error occurred. Please try again later."
        },
        async register(values) {
            const { name, email, password, age, country } = values;
            // Tells VeeValidate that submission is done
            this.reg_in_submission = true;
            let userCreds = null;
            userCreds = await createUser(name, email, password);
            if (userCreds.user) {
                // Add the user to the database
                const status = await addUser(userCreds.user.uid, { name, email, age, country });
                if (status) {
                    this.reg_in_submission = false;
                    this.reg_show_alert = true;
                    this.reg_alert_variant = "bg-green-500";
                    this.reg_alert_msg = "Success! You are successfully registered.";
                    this.isLoggedIn = true;
                } else {
                    this.handleError();
                }
            } else {
                this.handleError();
            }
            setTimeout(() => {
                this.reg_show_alert = false;
            }, 3000);
        },
    },
    // createUser()
}

</script>
