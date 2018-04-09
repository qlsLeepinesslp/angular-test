import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule, FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import * as decode from 'jwt-decode';

// const httpOptions = {
//   headers: new HttpHeaders({ 'Content-Type': 'application/json' })
// };
const headers: {} = new HttpHeaders({ 'Content-Type': 'application/json; charset=utf-8' });
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private router: Router, private http: HttpClient, private formBuilder: FormBuilder) {
  }

  username: string;
  password: string;
  userDetail: {};
  formLogin: FormGroup;

  ngOnInit() {
    this.createFormLogin();
  }

  createFormLogin(): void {
    this.formLogin = this.formBuilder.group({
      // username: [null, [Validators.required, Validators.email]],
      username: [null, [Validators.required]],
      password: [null, Validators.required]
    });

  }

  login(): void {
    if (this.formLogin.valid) {
      this.http.post('http://localhost:3000/api/login', '', headers).subscribe(
        resp => {
          localStorage.setItem('token', resp['token']);
          this.userDetail = decode(localStorage.getItem('token'));
          // console.log('form submitted');
          // console.log(this.userDetail);
          if (this.userDetail['user']['id']) {
            this.router.navigate(['user']);
          }
        },
        err => {
          console.log(err);
        }
      );
    } else {
      this.validateAllFormFields(this.formLogin);
    }
  }

  validateAllFormFields(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(field => {
      // console.log(field);
      const control = formGroup.get(field);
      if (control instanceof FormControl) {
        control.markAsTouched({ onlySelf: true });
      } else if (control instanceof FormGroup) {
        this.validateAllFormFields(control);
      }
    });
  }

  isFieldValid(field: string) {
    return !this.formLogin.get(field).valid && this.formLogin.get(field).touched;
  }

}
