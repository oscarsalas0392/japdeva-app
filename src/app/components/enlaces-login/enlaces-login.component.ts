import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-enlaces-login',
  templateUrl: './enlaces-login.component.html',
  styleUrls: ['./enlaces-login.component.scss'],
  standalone: true,
  imports: [RouterLink, TranslateModule],
})
export class EnlacesLoginComponent {}
