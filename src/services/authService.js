import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth } from "../config/firebase";

async function login(email, password) {
    const credential = await signInWithEmailAndPassword(auth, email, password);
    return credential.user;
}

async function logout() {
    await signOut(auth);
}

export{ login, logout };