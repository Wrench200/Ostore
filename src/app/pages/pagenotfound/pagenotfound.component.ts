import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { APIService } from '../../Services/api.service';

@Component({
  selector: 'app-pagenotfound',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './pagenotfound.component.html',
  styleUrl: './pagenotfound.component.scss'
})
export class PagenotfoundComponent implements OnInit {
  constructor(public api: APIService) {
  
  }
  ngOnInit(): void {
    this.api.hide()
  }
  
}
