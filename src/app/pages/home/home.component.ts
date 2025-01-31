import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router, ActivationEnd } from '@angular/router';
import { filter, map, flatMap } from 'rxjs/operators';
import { APIService } from '../../service/api.service';
import { SharedService } from '../../service/shared.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  slideCt = [];
  isLoading: Boolean = true;
  errorData: any;

  constructor(
    private router: Router,
    private titleService: Title,
    private apiService: APIService,
    private sharedService: SharedService
  ) {
        this.router.events.pipe(
          filter(event => event instanceof ActivationEnd)
        ).subscribe(event => {
          this.titleService.setTitle(event['snapshot'].data['title']);
        });
  }

  ngOnInit() {
    this.sliderContent();
  }

  async sliderContent() {
    try {
      // "await" will wait for the promise to resolve or reject
      // if it rejects, an error will be thrown, which you can
      // catch with a regular try/catch block
      await this.apiService.getContent().
        then(
          (res) => {
            this.slideCt = res['content'][0]['slider'];
            console.log('Slider => ', this.slideCt);
            this.isLoading = false;
          }
        );
    } catch (error) {
      this.errorData = this.sharedService.getErrorKeys(error.statusText);
      this.isLoading = false;
      console.log('errorData => ', this.errorData);
    }
  }

}
