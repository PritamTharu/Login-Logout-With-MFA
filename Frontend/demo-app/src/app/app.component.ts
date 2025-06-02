import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NgxUiLoaderModule,NgxUiLoaderRouterModule,NgxUiLoaderHttpModule} from "ngx-ui-loader";
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet,NgxUiLoaderModule,NgxUiLoaderRouterModule,NgxUiLoaderHttpModule,NgbModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'demo-app';
}
