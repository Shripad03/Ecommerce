import { Component, ViewEncapsulation, OnInit, OnDestroy, Inject, OnChanges } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { DOCUMENT } from '@angular/common';
import { AuthService } from './auth/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  encapsulation: ViewEncapsulation.Emulated
})
export class AppComponent implements OnInit, OnChanges, OnDestroy {

  title = 'Ecommerce POC by Piyali Das';
  custIsAuthenticated = false;
  custName: string;
  private authListenerSubs: Subscription;

  constructor(
    private titleService: Title,
    private meta: Meta,
    private authService: AuthService,
    @Inject(DOCUMENT) private doc
  ) {}

  ngOnInit() {
    this.setPageTitle();
    this.createLinkForCanonicalURL();
    this.authService.autoAuthCust();
    this.checkAuthentication();
  }

  ngOnChanges() {
    this.checkAuthentication();
  }

  setPageTitle() {
    this.titleService.setTitle(this.title);
    this.meta.addTag({name: 'keywords', content: 'Angular Project, Ecommerce Project'});
    this.meta.addTag({name: 'description', content: 'Angular project POC by Piyali Das'});
    this.meta.addTag({name: 'author', content: 'Piyali Das'});
    this.meta.addTag({name: 'robots', content: 'index, follow'});
  }

  createLinkForCanonicalURL() {
    const link: HTMLLinkElement = this.doc.createElement('link');
    link.setAttribute('rel', 'canonical');
    this.doc.head.appendChild(link);
    link.setAttribute('href', this.doc.URL);
 }

 checkAuthentication() {
  this.custName = this.authService.getCustName()[0];
  this.custIsAuthenticated = this.authService.getIsAuth();
  this.authListenerSubs = this.authService.getLoggedInStatusListener()
    .subscribe(isAuthenticated => {
      this.custIsAuthenticated = isAuthenticated;
      this.custName = this.authService.getCustName()[0];
      console.log('Header Details => ', this.custIsAuthenticated, this.custName);
    });
 }

ngOnDestroy() {
  this.authListenerSubs.unsubscribe();
}

}


