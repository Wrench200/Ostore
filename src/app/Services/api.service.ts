import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { initFlowbite } from 'flowbite';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class APIService {
  navbar :boolean
  constructor(private http: HttpClient) {
  this.navbar = true
  }
  hide() { this.navbar = false }
  show() {
    this.navbar = true
  }

  private reloadCartSubject = new BehaviorSubject<boolean>(false);
  public reloadCart$ = this.reloadCartSubject.asObservable();

  triggerReloadCart() {
    this.reloadCartSubject.next(true);
  }

}
