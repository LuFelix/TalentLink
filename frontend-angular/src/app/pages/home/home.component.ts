import { Component } from '@angular/core';
// Importe dos componentes de section
import { HeroSectionComponent } from '../../components/hero-section/hero-section.component';
import { AboutUsSectionComponent } from '../../components/about-us-section/about-us-section.component';
import { OpenVacanciesSectionComponent } from '../../components/open-vacancies-section/open-vacancies-section.component';
import { ContactSectionComponent } from '../../components/contact-section/contact-section.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    // Lista de componente usados no template
    HeroSectionComponent,
    AboutUsSectionComponent,
    OpenVacanciesSectionComponent,
    ContactSectionComponent,
  ],
  templateUrl: './home.component.html',
})
export class HomeComponent {
  //Lógica da Home.
}

// import { Component } from '@angular/core';

// @Component({
//   selector: 'app-home',
//   standalone: true,
//   template: `<h1>Bem-vindo ao TalentLink</h1>`, // Template mínimo
//   styles: [],
// })
// export class HomeComponent {}
