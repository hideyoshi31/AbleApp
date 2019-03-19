<template>
  <div class="home" style="margin-left: 20px;">
      <p>お名前</p>
      <input v-model="name" placeholder="Name"><br><br>
      <p>メールアドレス</p>
      <input type="email" v-model="email" maxlength="30"><br><br>
      <p>お問い合わせ内容</p>
      <input v-model="message" placeholder="message"><br><br>
      <button @click="sendItem">送信する</button>
      <p v-if="showMessage" style="margin-top: 20px">
          フォームが正常に送信されました。
      </p>
  </div>
</template>
<script>
// Vue CLIで作成したアプリでは、@マークは./srcを指す
import firebase from '@/firebase/firestore'

export default {
  name: 'home',
  data() {
    return {
        name: '',
        email: '',
        message: '',
        items: [],
        showMessage: false,
    }
  },
  
  methods: {
   sendItem(){
     const colref = firebase.firestore().collection("formcontent"); // "formcontent"という名前のコレクションへの参照を作成
     
     // 保存用JSONデータを作成
     const saveData = {
        name: this.name,
        email: this.email,
        message: this.message
     };
     
     // addの引数に保存したいデータを渡す
     colref.add(saveData).then(function(docRef) {
          // 正常にデータ保存できた時の処理
          console.log("Document written with ID: ", docRef.id);
      }).catch(function(error) {
          // エラー発生時の処理
          console.error("Error adding document: ", error);
      });

      this.showMessage = true;
   },
  }
}
</script>