import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {TranslateService} from '@ngx-translate/core';
import {ArtifactHeaderComponent} from '../modules/shared/components/artifact-header/artifact-header.component';


@Injectable({
  providedIn: 'root'
})
export class UiService {

  public valid: boolean;
  public title: string;
  public type: string;
  public description: string;
  public hasTitle: BehaviorSubject<string> = new BehaviorSubject('');
  public hasDescription: BehaviorSubject<string> = new BehaviorSubject('');
  private artifactHeaderComponent: ArtifactHeaderComponent;

  constructor(private translateService: TranslateService) {
  }

  public setTitleAndDescription(title: string, description: string, type: string) {
    this.type = type;
    if (title !== this.title) {
      this.title = title;
      this.hasTitle.next(this.title);
    }
    if (description !== this.description) {
      this.description = description;
      this.hasDescription.next(this.description);
    }
  }

  public setValidity(valid: boolean) {
    this.valid = valid;
  }

  openInCedar() {
    let destination = window.location.href;
    console.log(destination);
    destination = window.location.href.replace('openview', 'cedar');
    console.log(destination);
    destination = destination.replace('/templates/', '/templates/edit/');
    destination = destination.replace('/template-elements/', '/elements/edit/');
    destination = destination.replace('/template-fields/', '/fields/edit/');
    destination = destination.replace('/template-instances/', '/instances/edit/');
    console.log(destination);
    this.openUrlInBlank(destination);
  }

  openUrlInBlank(destination) {
    window.open(destination, '_blank');
  }

  populateInCedar() {
    let destination = window.location.href;
    destination = window.location.href.replace('openview', 'cedar');
    destination = destination.replace('/templates/', '/instances/create/');
    // console.log(destination);
    window.open(destination, '_blank');
  }

  // copy stuff in tabs to browser's clipboard
  copyToClipboard(elementId: string, buttonId: string) {

    function copyToClip(str) {
      function listener(e) {
        e.clipboardData.setData('text/html', str);
        e.clipboardData.setData('text/plain', str);
        e.preventDefault();
      }

      document.addEventListener('copy', listener);
      document.execCommand('copy');
      document.removeEventListener('copy', listener);
    }

    const elm = document.getElementById(elementId);
    const data = elm ? elm.innerHTML : null;
    if (data) {

      const selBox = document.createElement('textarea');
      selBox.style.position = 'fixed';
      selBox.style.left = '0';
      selBox.style.top = '0';
      selBox.style.opacity = '0';
      selBox.value = data;
      document.body.appendChild(selBox);
      selBox.focus();
      selBox.select();
      copyToClip(data);
      document.body.removeChild(selBox);

      const btn = document.getElementById(buttonId);
      if (btn) {
        btn.innerHTML = this.translateService.instant('App.Copied');
        setTimeout(() => {
          btn.innerHTML = this.translateService.instant('App.Copy');
        }, 10000);
      }
    }
  }


  openArtifactHeader() {
    this.artifactHeaderComponent.doOpen();
  }

  closeArtifactHeader() {
    this.artifactHeaderComponent.doClose();
  }

  registerArtifactHeaderComponent(c: ArtifactHeaderComponent) {
    this.artifactHeaderComponent = c;
  }
}


