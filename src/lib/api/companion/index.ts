import { initializeApp } from "firebase/app";
import { doc, getDoc, getFirestore } from "firebase/firestore";

import { Legacy } from "@brainly";

import flashMsg from "@lib/flashMsg";

export default new class CompanionAPI {
  private firebaseConfig = {
    projectId: "brainly-companion"
  };

  private async GetData(method:string) {
    const docm = await getDoc(doc(
      getFirestore(initializeApp(this.firebaseConfig)), method)
    );
    return docm.data();
  }

  SavedData() {
    const permArr = JSON.parse(localStorage.getItem("comp-perms"));
    const userId = localStorage.getItem("comp-uid");

    return {
      user: {
        isModerator: permArr.includes(1),
        isAnswerer: permArr.includes(11),
        isMentor: permArr.includes(31),
        isAdmin: permArr.includes(0),
        isET: permArr.includes(41),
        id: +userId
      }
    };
  }

  async UserData() {
    let uData = await Legacy.MyData();
    let user = uData.data.user;

    localStorage.setItem("comp-uid", user.id + "");

    let docm = await this.GetData(`users/u-${user.id}`);

    return docm ? docm : flashMsg(
      `User ${user.nick} not found. Please Contact Saransh to add you to the extension`, "error"
    );
  }
  async Config() {
    return this.GetData("data/config");
  }
  async MsgTemplates() {
    return this.GetData("data/msgTemplates");
  }
  async Links() {
    return this.GetData("data/aLinks");
  }
};