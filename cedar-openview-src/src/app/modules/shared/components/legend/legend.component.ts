import {Component} from '@angular/core';
import {
  faAsterisk,
  faCalendar,
  faCheckSquare,
  faDotCircle,
  faEnvelope,
  faExternalLinkAlt,
  faFont,
  faHashtag,
  faLink,
  faList,
  faParagraph,
  faPhoneSquare,
  faPlusSquare
} from '@fortawesome/free-solid-svg-icons';


@Component({
  selector: 'app-legend',
  templateUrl: './legend.component.html',
  styleUrls: ['./legend.component.scss'],
  providers: []
})

export class LegendComponent  {

  faAsterisk = faAsterisk;
  faEnvelope = faEnvelope;
  faHashtag = faHashtag;
  faLink = faLink;
  faFont = faFont;
  faCalendar = faCalendar;
  faPhoneSquare = faPhoneSquare;
  faParagraph = faParagraph;
  faCheckSquare = faCheckSquare;
  faList = faList;
  faDotCircle = faDotCircle;
  faPlusSquare = faPlusSquare;
  faExternalLinkAlt = faExternalLinkAlt;

  constructor() {
  }
}
