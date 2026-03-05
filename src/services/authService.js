import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../config/firebase";

async function login(email, password) {
    const credential = await signInWithEmailAndPassword(auth, email, password);
    return credential.user;
}

export{ login };