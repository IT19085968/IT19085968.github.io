import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/modules/auth.service';
import { User } from '../../models/User';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnInit {
  user: any = {
    id: '',
    userName: '',
    password: '',
    isActive: '',
  };

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.displayUserName();
  }

  displayUserName(): void {
    if (this.authService.isLoggedIn()) {
      this.user = this.authService.userData;
    }
  }
}
