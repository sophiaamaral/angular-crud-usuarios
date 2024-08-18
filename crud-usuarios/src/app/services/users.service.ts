import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { User } from '../interfaces/user';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  user: User = {
    name: 'Sophia Amaral Silva',
    email: 'sophia_amaral@gmail.com',
    sector: 'Tecnologia',
    role: 'Desenvolvedora Full Stack',
  }

  constructor(private dataBaseStore: AngularFirestore) { }

  getAllUsers(){ //obtêm todos os usuários em ordem alfabetica por nome
    return this.dataBaseStore.collection('users', user => user.orderBy('name')).valueChanges({idField: 'firebaseId'}) as Observable<any[]>;
  }

  addUser(user: User){ //adiciona novos usuários
    return this.dataBaseStore.collection('users').add(user);
  }

  update(userId: string, user: User){ //atualizar um usuário com um id em especifico
    return this.dataBaseStore.collection('users').doc(userId).update(user);
  }
  deleteUser(userId: string){
    return this.dataBaseStore.collection('users').doc(userId).delete();
  }
}
