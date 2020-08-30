import { Injectable, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Usuario } from '../models/usuario.model';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    private auth: AngularFireAuth,
    private firestore: AngularFirestore
  ) {}

  initAuthListener() {
    this.auth.authState.subscribe((firebaseUser) => {
      console.log(firebaseUser?.email);
      console.log(firebaseUser?.uid);
    });
  }

  crearUsuario(nombre: string, correo: string, password: string) {
    return (
      this.auth
        .createUserWithEmailAndPassword(correo, password)
        // .then((firebaseUser) => {
        .then(({ user }) => {
          // Usando la desestructuracion
          const nuevoUsuario = new Usuario(user.uid, nombre, user.email);
          return (
            this.firestore
              .doc(`${nuevoUsuario.uid}/usuarios`)
              // .set({
              //   nombre: nuevoUsuario.nombre,
              //   email: nuevoUsuario.email,
              //   uid: nuevoUsuario.uid,
              // });
              .set({ ...nuevoUsuario })
          ); // Usando la desestructuracion
        })
    );
  }

  login(email: string, password: string) {
    return this.auth.signInWithEmailAndPassword(email, password);
  }

  logout(): Promise<any> {
    return this.auth.signOut();
  }

  isAuthenticated(): Observable<boolean> {
    return this.auth.authState.pipe(
      map((firebaseUser) => firebaseUser !== null)
    );
  }
}
