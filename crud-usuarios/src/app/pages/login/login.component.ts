import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  userName: string;

  constructor(private rota: Router) {}

  login(){
    sessionStorage.setItem('nome', this.userName); // quando faz o login seta o nome da variavel do sessionStorage para nome
    this.rota.navigate(['home']); // navega para a pagina home
  }

}
