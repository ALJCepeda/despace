<template>
  <main class="p-10">
    <div v-if="!connected">
      <input type="text" v-model="http" class="mr-10 border border-gray-300 p-2">

      <button @click="connect" class="border border-gray-500 px-4 py-2">Connect</button>
    </div>

    <div v-if="connected" class="mb-4">
      <h1 class="text-2xl mb-3">Accounts:</h1>
      <div v-for="account in accounts" class="account-row p-1" @click="clickedAccount(account)" :class="{ selected: selectedAccount === account }">
        {{ account.address }}: {{ account.eth }} eth
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
        <button @click="clickedRecover" class="border border-gray-500 px-4 py-2 mt-4">Recover App</button>
      </div>

      <div v-for="_app in apps" class="app-row p-1 text-xl" @click="clickedApp(_app)" :class="{ selected: app === _app }">{{ _app.name }} - {{ _app.address }}</div>
    </section>

    <section v-if="app">
      <h1 class="text-2xl mb-5">
        {{ app.name }} - {{ app.version }}
        <a @click="clickedDownload" class="text-sm text-blue-500 cursor-pointer">download</a>
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
import appAbiStr from '../dist/_App_sol_App.abi';
import appBin from '../dist/_App_sol_App.bin';
import messageAbiStr from '../dist/_Message_sol_Message.abi';
import messageBin from '../dist/_Message_sol_Message.bin';

const appAbi = JSON.parse(appAbiStr);
const messageAbi = JSON.parse(messageAbiStr);

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
      accounts: [],
      messages: []
    }
  },

  methods: {
    async createApp() {
      const contract = new this.w3.eth.Contract(appAbi);
      const appName = this.$refs['app-name'].value;

      const transaction = contract.deploy({
        data: appBin ,
        arguments: [appName, '1.0.0']
      });

      const instance = await transaction.send({
        from: this.selectedAccount.address,
        gas: 1500000,
        gasPrice: '30000000000'
      });

      this.app = {
        name: appName,
        version: '1.0.0',
        address: instance.options.address,
        messages: []
      };

      this.saveApp();
    },

    async clickedRecover() {
      const base = this.$refs['recover'].value;

      if(!base) {
        alert('Must enter a recovery code');
        return;
      }

      const jsonStr = atob(base);
      const digest = JSON.parse(jsonStr);
      const [ owner, address ] = digest[0];
      const messageAddresses = digest[1];

      if(this.selectedAccount.address !== owner) {
        alert('That digest doesn\'t belong to you');
        return;
      }

      const appContract = new this.w3.eth.Contract(appAbi, address);
      const name = await appContract.methods.username().call();
      const version = await appContract.methods.version().call();

      const messages = await Promise.all(
        messageAddresses.map(async (address) => {
          const messageContract = new this.w3.eth.Contract(messageAbi, address);
          const title = await messageContract.methods.title().call();
          const body = await messageContract.methods.body().call();

          return {
            title, body, address
          };
        })
      );

      this.app = { name, version, address, messages };
      this.saveApp();
    },

    clickedAccount(account) {
      if(this.selectedAccount !== account) {
        this.selectedAccount = account;
        this.app = null;
      }
    },

    clickedDownload() {
      const digest = [
        [ this.selectedAccount.address, this.app.address ],
        this.app.messages.map((message) => message.address)
      ];

      console.log(btoa(JSON.stringify(digest)));
    },

    async clickedApp(app) {
      this.app = app;
    },

    connect() {
      this.provider = new Web3.providers.HttpProvider(this.http)
      this.w3 = new Web3(this.provider)

      this.fetchAccounts()
          .then(this.fetchBalances)
          .then(() => this.connected = true)
    },

    fetchAccounts() {
      return this.w3.eth.getAccounts().then((resp) => {
        this.accounts = resp.map((address) => ({
          address,
          wei: null,
          eth: null
        }))
      })
    },

    fetchBalances() {
      const fetches = this.accounts.map((account) => {
        return this.w3.eth.getBalance(account.address)
      })

      Promise.all(fetches).then((balances) => {
        balances.forEach((balance, index) => {
          this.accounts[index].wei = balance;
          this.accounts[index].eth = this.w3.utils.fromWei(balance, 'ether')
        })
      })
    },

    async addMessage() {
      const title = this.$refs['title'].value;
      const body = this.$refs['body'].value;

      const contract = new this.w3.eth.Contract(messageAbi);

      const transaction = contract.deploy({
        data: messageBin,
        arguments: [title, body]
      });

      const instance = await transaction.send({
        from: this.selectedAccount.address,
        gas: 1500000,
        gasPrice: '30000000000'
      });

      this.app.messages.push({ title, body, address: instance.options.address });
      this.saveApp();
    },

    saveApp() {
      const appStr = localStorage.getItem('apps') || '{}';
      const apps = JSON.parse(appStr);

      apps[this.selectedAccount.address] = {
        ...apps[this.selectedAccount.address],
        [this.app.address]: this.app
      };

      localStorage.setItem('apps', JSON.stringify(apps));
    },
  },

  computed: {
    apps() {
      if(this.selectedAccount && localStorage.getItem('apps')) {
        const apps = JSON.parse(localStorage.getItem('apps'))
        return Object.values(apps[this.selectedAccount.address] || {});
      }

      return null
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
