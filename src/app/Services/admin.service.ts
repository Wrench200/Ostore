import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class AdminService {
  api: string = 'http://localhost:3000'
  constructor(private http: HttpClient) { }
  create(data: any, images: any) {
    const formData = new FormData();
    Object.keys(data).forEach((element: any) => {
      formData.append(`${element}`, data[element])
    });
    images.forEach((element: any) => {

      formData.append('images', element)
    })
    console.log(formData);

    return this.http.post<any>(`${this.api}/products/create`, formData)



  }
  getall(category: string, sort:string='string') {
    
    return this.http.get<any>(`${this.api}/products/all/${category}/${sort}`)
  }
  deleteOne(id: string) {
    return this.http.delete<any>(`${this.api}/products/delete/${id}`)
  }
  deleteAll() {
    return this.http.delete<any>(`${this.api}/products/deleteall`)
  }
  search(query:string) {
    return this.http.get<any>(`${this.api}/products/search/${query}`)
  }
  getOne(id:string) {
    return this.http.get<any>(`${this.api}/products/getone/${id}`)
  }
  
}
