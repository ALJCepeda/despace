<template>
  <main class="p-10">
    <div v-if="!connected">
      <input type="text" v-model="http" class="mr-10 border border-gray-300 p-2">

      <button @click="connect" class="border border-gray-500 px-4 py-2">Connect</button>
    </div>

    <div v-if="connected" class="mb-4">
      <h1 class="text-2xl mb-3">Accounts:</h1>
      <div v-for="account in accounts" class="account-row p-1" @click="clickedAccount(account)" :class="{ selected: selectedAccount === account }">
        {{ account.address }}: {{ account.eth }}
      </div>
    </div>

    <section v-if="selectedAccount" class="mb-4">
      <h1 class="text-2xl mb-3">DeSpace Apps:</h1>

      <div>
        <input type="text" ref="app-name" class="mr-10 border border-gray-300 p-2" />
        <button @click="createApp" class="border border-gray-500 px-4 py-2 mt-4">Create App</button>
      </div>

      <div class="mb-4">
        <input type="text" ref="recover" class="mr-10 border border-gray-300 p-2" />
        <button @click="clickedRecover" class="border border-gray-500 px-4 py-2 mt-4">Recovery Address</button>
      </div>

      <div v-for="save in saves" class="app-row p-1 text-xl" @click="clickedSave(save)" :class="{ selected: app === save.app }">{{ save.app.name }} - {{ save.backup.app }}</div>
    </section>

    <section v-if="app">
      <h1 class="text-2xl mb-5">
        {{ app.name }} - {{ app.version }}
        <a @click="clickedBackup" class="text-sm text-blue-500 cursor-pointer">backup</a>
      </h1>

      <div class="flex flex-col">
        <input type="text" ref="title" class="border border-gray-300 p-2" />
        <textarea ref="body" class="border border-gray-300 p-2" />
        <button @click="addMessage" class="border border-gray-500 px-4 py-2 mt-4">Add Message</button>
      </div>

      <div class="flex flex-col container items-center text-center">
        <article v-for="message in app.messages" class="w-96 my-5 py-4 border">
          <div>{{ message.title }}</div>
          <div>{{ message.body }}</div>
        </article>
      </div>
    </section>
  </main>
</template>

<script>
import { defineComponent } from 'vue';
import Web3 from 'web3';
import {AppAPI} from "@/api/App";
import {MessagesAPI} from "@/api/Messages";
import {AccountsAPI} from "@/api/Accounts";
import {BackupAPI} from "@/api/Backup";
import {Backup} from "@/models/Backup";
import {App} from "@/models/App";
import {Message} from "@/models/Message";

export default defineComponent({
  name: 'App',

  data() {
    return {
      connected: false,
      http: 'http://127.0.0.1:8545',
      provider: null,
      w3: null,
      selectedAccount: null,
      selectedApp: null,
      app: null,
      backup: null,
      accounts: [],
      messages: []
    }
  },

  methods: {
    async createApp() {
      const name = this.$refs['app-name'].value;

      const appInstance = await AppAPI.init(this.w3, name, this.selectedAccount.address);
      const messageInstance = await MessagesAPI.init(this.w3, this.selectedAccount.address);

      this.app = new App({
        name,
        version: '1.0.0'
      });

      this.backup = new Backup({
        app: appInstance.options.address,
        messages: messageInstance.options.address
      })

      this.saveApp();
    },

    async clickedRecover() {
      const address = this.$refs['recover'].value;

      if(!address) {
        alert('Must enter a recovery address');
        return;
      }

      const { app, backup } = await BackupAPI.recover(this.w3, address);
      this.app = app;
      this.backup = backup;
      this.saveApp();
    },

    clickedAccount(account) {
      if(this.selectedAccount !== account) {
        this.selectedAccount = account;
        this.app = null;
      }
    },

    async clickedBackup() {
      const instance = await BackupAPI.create(this.w3, this.backup, this.selectedAccount.address);
      const message = `Backup stored at: ${instance.options.address}`;
      alert(message);
      console.log(message);
    },

    async clickedSave(save) {
      this.app = save.app;
      this.backup = save.backup;
    },

    connect() {
      this.provider = new Web3.providers.HttpProvider(this.http)
      this.w3 = new Web3(this.provider)

      AccountsAPI.get(this.w3).then((accounts) => this.accounts = accounts)
        .then(() =>
          AccountsAPI.balances(this.w3, this.addresses)
        ).then((balances) =>
          balances.forEach((balance, index) => {
            this.accounts[index].wei = balance;
            this.accounts[index].eth = this.w3.utils.fromWei(balance, 'ether')
          })
        ).then(() => this.connected = true);
    },

    async addMessage() {
      const message = new Message({
        title: this.$refs['title'].value,
        body: this.$refs['body'].value
      })

      await MessagesAPI.create(this.w3, message, this.backup.messages, this.selectedAccount.address);

      this.app.messages.push(message);
      this.saveApp();
    },

    saveApp() {
      const appStr = localStorage.getItem('apps') || '{}';
      const apps = JSON.parse(appStr);
      const savesForAccount = apps[this.selectedAccount.address] || [];

      apps[this.selectedAccount.address] = savesForAccount
        .filter((save) => save.backup.app !== this.backup.app)
        .concat({
          app: this.app,
          backup: this.backup
        });

      localStorage.setItem('apps', JSON.stringify(apps));
    },
  },

  computed: {
    addresses() {
      return this.accounts.map((account) => account.address);
    },

    saves() {
      if(this.selectedAccount && localStorage.getItem('apps')) {
        const apps = JSON.parse(localStorage.getItem('apps'))
        return Object.values(apps[this.selectedAccount.address] || []);
      }

      return [];
    }
  }
});
</script>

<style lang="scss">
.account-row, .app-row {
  cursor:pointer;
}

.account-row.selected, .app-row.selected {
  color: blue;
}
</style>
