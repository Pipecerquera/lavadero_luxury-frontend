import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IonContent, IonHeader, IonIcon, IonTitle, IonToolbar, IonList, IonLabel } from "@ionic/angular/standalone";

@Component({
  selector: 'app-menu', // Ensure this is unique and not conflicting with other components
  imports: [IonLabel, IonList, IonToolbar, IonTitle, IonIcon, IonHeader, IonContent, RouterLink, CommonModule],
  standalone: true,
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css',
})
export class MenuComponent implements OnInit {
  userRole: string = '';

  ngOnInit(): void {
    const role = localStorage.getItem('rol');
    if (role) {
      this.userRole = role;
    }
  }
}
