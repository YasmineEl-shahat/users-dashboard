import { Component, OnInit } from '@angular/core';
import {
  trigger,
  state,
  style,
  transition,
  animate,
} from '@angular/animations';
import { HeaderComponent } from '../header/header.component';
import { CommonModule } from '@angular/common';
import { MatPaginatorModule } from '@angular/material/paginator';
import { UserService } from '../user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css'],
  standalone: true,
  animations: [
    trigger('cardAnimation', [
      state('in', style({ transform: 'scale(1)' })),
      transition('void => *', [
        style({ transform: 'scale(0.5)' }),
        animate(300),
      ]),
    ]),
  ],
  imports: [CommonModule, MatPaginatorModule, HeaderComponent],
})
export class UserListComponent implements OnInit {
  users: any[] = [];
  filteredUsers: any[] = [];
  totalUsers: number = 0;

  constructor(private userService: UserService, private router: Router) {}

  ngOnInit(): void {
    this.loadUsers(1);
  }

  loadUsers(page: number): void {
    this.userService.getUsers(page).subscribe((data) => {
      this.users = data.data;
      this.filteredUsers = this.users;
      this.totalUsers = data.total;
    });
  }

  onPageChange(event: any): void {
    this.loadUsers(event.pageIndex + 1);
  }

  goToUserDetail(userId: number): void {
    this.router.navigate([`/user/${userId}`]);
  }
  handleSearch(searchTerm: string): void {
    if (!searchTerm) {
      this.filteredUsers = this.users;
    } else {
      this.filteredUsers = this.users.filter((user) =>
        (user.first_name + ' ' + user.last_name)
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
      );
    }
  }
}
