import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { UsersService } from '../../../services/users.service';
import { User } from '../../../interfaces/user';

@Component({
  selector: 'app-modal-form-user',
  templateUrl: './modal-form-user.component.html',
  styleUrl: './modal-form-user.component.scss'
})
export class ModalFormUserComponent {

  planosSaude = [
    {
      id: 1,
      descricao: 'Plano 300 Enfermaria'
    },
    {
      id: 2,
      descricao: 'Plano 400 Enfermaria'
    },
    {
      id: 3,
      descricao: 'Plano 500 Plus'
    }
  ]

  planosOdonto = [
    {
      id: 1,
      descricao: 'Plano Basic'
    },
    {
      id: 2,
      descricao: 'Plano Medium'
    },
    {
      id: 3,
      descricao: 'Plano Plus'
    }
  ]

  formUser: FormGroup;

  editUser: boolean = false;

  constructor(
    // Referência ao modal, permitindo o controle sobre ele (fechar, passar dados de volta, etc.)
    public dialogRef: MatDialogRef<ModalFormUserComponent>,
    // Injeção do FormBuilder para facilitar a criação de formulários reativos
    private formBuilder: FormBuilder,
    // Serviço de usuários para gerenciar operações relacionadas a usuários
    private userService: UsersService,
    // Injeção de dados passados para o modal via MAT_DIALOG_DATA
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {}

  ngOnInit(){
    this.buildForm();
    if(this.data && this.data.name){
      this.editUser = true;
    }
  }

  saveUser(){
    // Captura os dados em forma de objeto
    const objUserForm: User = this.formUser.getRawValue();
    console.log('Dados do formulário antes de salvar:', objUserForm);
    if(this.data && this.data.name){
      // editar usuario
      this.userService.update(this.data.firebaseId, objUserForm).then(
        (response: any) => {
          window.alert('Usuário Editado com sucesso');
          this.closeModal();
        })
        .catch(
          err => {
            window.alert('Houve um erro ao salvar o usuário');
            console.error(err);
        });
    }else{
      // salvar usuario
      this.userService.addUser(objUserForm).then(
        (response: any) => {
          window.alert('Usuário foi salvo com sucesso');
          this.closeModal();
        })
        .catch(
          err => {
            window.alert('Houve um erro ao salvar o usuário');
            console.error(err);
        });
    }
  }

  buildForm(){
    this.formUser = this.formBuilder.group({
      //Inicia com null para adicionar o usuario o campo vem vazio e depois você preenche
      name: [null, [Validators.required, Validators.minLength(3)]], //Valida email, campo min e max, obrigatorio
      email: [null, [Validators.required, Validators.email]], 
      sector: [null, [Validators.required, Validators.minLength(2)]], 
      role: [null, [Validators.required, Validators.minLength(5)]], 
      healthPlan: [''], //Não são obrigatorios e caso o usuario não preencha nada manda para o banco vazio e não como null
      dentalPlan: [''], //Não são obrigatorios "

    });
    if(this.data && this.data.name){
      this.fillForm();
    }
  }

  // Para preencher todos os campos de uma vez só
  // Preencher formulario para edição
  fillForm(){
    this.formUser.patchValue({
      name: this.data.name,
      email: this.data.email,
      sector: this.data.sector,
      role: this.data.role,
      healthPlan: this.data.healthPlan,
      dentalPlan: this.data.dentalPlan,
    });
  }

  closeModal() {this.dialogRef.close(); }
}
