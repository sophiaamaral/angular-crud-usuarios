import { Component, ViewChild } from '@angular/core';
import { UsersService } from '../../services/users.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { User } from '../../interfaces/user';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { ModalViewUserComponent } from './modal-view-user/modal-view-user.component';
import { ModalFormUserComponent } from './modal-form-user/modal-form-user.component';

@Component({
  selector: 'app-crud',
  templateUrl: './crud.component.html',
  styleUrl: './crud.component.scss'
})
export class CrudComponent {

  displayedColumns: string[] = ['id', 'name', 'email', 'role', 'benefits', 'action'];
  dataSource: any;
  listusers: User[] = []; // Inicializo uma variavel do tipo User como array vazio

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private usersService: UsersService, public dialog: MatDialog){
    // Para não ter erro 
    this.dataSource = new MatTableDataSource<any>(this.listusers);
  }

  // Ao inicializar a aplicação já é chamado a função getListUsers
  ngOnInit(){
    this.getListUsers();
  }

  ngAfterViewInit() { //Depois que o componente for carregado inicia a paginação
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  // FUNÇÕES DOS USUÁRIOS
  getListUsers(){
    // subscribe é uma inscrição que faz a conexão do front com o back
    // Ele fica escutando o que o back-end está enviando sem precisar carregar a página 
    this.usersService.getAllUsers().subscribe({
      // Caso dê sucesso
      next: (response: any) => {
        
        console.log('Lista de usuários firebase', response);
        this.listusers = response; // Depois que obter a lista de usuarios guarda no listusers
        
        // dataSource são os dados da tabela
        this.dataSource = new MatTableDataSource<any>(this.listusers); // variavel dataSource recebe o valor que estiver na listusers
        // Arruma a paginação novamente após obter os usuarios
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        // Para deixar em portugues
        this.paginator._intl.itemsPerPageLabel="Itens por página"

      },
      // Caso dê erro
      error: (err) => {
        console.error(err);
      }
    }); 
  }
  
  deleteUser(firebaseId: string){
    this.usersService.deleteUser(firebaseId).then(
      (response: any) => {
        window.alert('Usuário excluído com sucesso')
      }
    );
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  // LÓGICA DO MODAL
  openModalViewUser(user: User){
    this.dialog.open(ModalViewUserComponent, {
      width: '700px',
      height: '330px',
      data: user
    })
  }

  openModalAddUser(){
    this.dialog.open(ModalFormUserComponent, {
      width: '700px',
      height: '410px'
    }).afterClosed().subscribe(() => this.getListUsers() ); //Quando o modal fechar chama a função para recarregar o usuário cadastrado
  }

  openModalEditUser(user: User){
    this.dialog.open(ModalFormUserComponent, {
      width: '700px',
      height: '410px',
      data: user
    }).afterClosed().subscribe(() => this.getListUsers() );
  }

}
