import { initializeApp } from "firebase/app";
import { doc, getDoc, getFirestore } from "firebase/firestore";

import { Legacy } from "@brainly";

import flashMsg from "@lib/flashMsg";

export default new class CompanionAPI {
  private firebaseConfig = {
    projectId: "brainly-companion"
  };

  SavedData() {
    let permArr = JSON.parse(localStorage.getItem("comp-perms"));
    let userId = localStorage.getItem("comp-uid");

    return {
      isModerator: permArr.includes(1),
      isAnswerer: permArr.includes(11),
      isMentor: permArr.includes(31),
      isAdmin: permArr.includes(0),
      id: +userId
    };
  }

  async UserData() {
    let uData = await Legacy.MyData();
    let user = uData.data.user;

    localStorage.setItem("comp-uid", user.id + "");

    let docm = await getDoc(doc(
      getFirestore(initializeApp(this.firebaseConfig)), 
      `users/u-${user.id}`
    ));

    return docm.exists ? docm.data() : flashMsg(
      `User ${user.nick} not found. Please Contact Saransh to add you to the extension`, "error"
    );
  }
};