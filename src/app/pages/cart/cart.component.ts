import { Component, OnInit, ElementRef } from '@angular/core';
import { Router, ActivatedRoute, ActivationEnd } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { filter, map } from 'rxjs/operators';
import { APIService } from '../../service/api.service';
import { SharedService } from '../../service/shared.service';
import { AuthService } from '../../auth/auth.service';
import { Subscription } from 'rxjs';

import { environment } from '../../../environments/environment';
const BACKEND_URL = environment.apiEndpoint;

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {
  isLoading: Boolean = true;
  imgURL: string;
  errorData: any;
  custIsAuthenticated = false;
  custFname: string;
  custMname: string;
  custLname: string;
  custToken: string;
  custEmail: string;
  private authListenerSubs: Subscription;
  cartProducts: any;
  pic: string;

  titleCaseWord(word: string) {
    if (!word) {
      return word;
    } else {
      return word[0].toUpperCase() + word.substr(1).toLowerCase();
    }
  }

  constructor(
    private titleService: Title,
    private router: Router,
    private Activatedroute: ActivatedRoute,
    private apiService: APIService,
    private sharedService: SharedService,
    private authService: AuthService,
    private el: ElementRef
  ) {
    this.router.events.pipe(
      filter(event => event instanceof ActivationEnd)
    ).subscribe(event => {
      this.titleService.setTitle(this.titleCaseWord(event['snapshot'].params['id']) + ' ' + event['snapshot'].data['title']);
    });
    this.imgURL = BACKEND_URL + environment.IMAGE_PATH;
    this.getSessionInfo();
  }

  ngOnInit() {
    this.getSessionInfo();
  }

  getSessionInfo() {
    this.custToken = this.authService.getToken();
    this.custEmail = this.authService.getCustMail();
    this.custFname = this.authService.getCustName()[0];
    this.custMname = this.authService.getCustName()[1];
    this.custLname = this.authService.getCustName()[2];
    this.custIsAuthenticated = this.authService.getIsAuth();
    this.authListenerSubs = this.authService.getLoggedInStatusListener()
      .subscribe(isAuthenticated => {
        this.custIsAuthenticated = isAuthenticated;
        this.custEmail = this.authService.getCustMail();
        this.custFname = this.authService.getCustName()[0];
        this.custMname = this.authService.getCustName()[1];
        this.custLname = this.authService.getCustName()[2];
        this.custToken = this.authService.getToken();
        this.checkProductInCart(this.custEmail);
      });
  }

  checkProductInCart(email) {
    this.apiService.isAvailableInCart(email).subscribe(
      data => {
        this.cartProducts = data.productsInCart[0].cartResponse;
        this.isLoading = false;
      },
      err => {
        this.errorData = this.sharedService.getErrorKeys(err.statusText);
        this.isLoading = false;
      }
    );
  }

  checkPath(imgsrc): string {
    if (imgsrc === undefined || imgsrc === '') {
      this.pic = 'empty_product.svg';
    } else {
      this.pic = imgsrc;
    }
    return this.pic;
  }

}
