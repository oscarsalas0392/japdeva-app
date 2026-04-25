import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FooterNavComponent } from '../../components/footer-nav/footer-nav.component';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.page.html',
  styleUrls: ['./tabs.page.scss'],
  standalone: true,
  imports: [RouterOutlet, FooterNavComponent],
})
export class TabsPage {}
