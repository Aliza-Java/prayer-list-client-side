import { Injectable, signal } from '@angular/core';
import { Subscription } from 'rxjs';
import { Davenfor } from '../models/davenfor.model';
import { HttpService } from './http.service';

@Injectable({
    providedIn: 'root'
})
export class DaveningService { // A general service to hold 'global' data relevant all around
    englishNamePattern = "^(?=.*[a-zA-Z])[a-zA-Z '\-]*$"; //lookahead ensures at least one letter is present
    hebrewNamePattern = "^(?=.*[\\u0590-\\u05fe])[\\u0590-\\u05fe '\\-]*$"; //also ensuring at least one hebrew letter is present
    //not sure this is needed:
    emailPattern = "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$";
    categories: string[] = [];
    categoriesSub: Subscription = new Subscription();
    showHeaderMenu: boolean = true;
    serverFine: boolean = true;
    successMessage = signal<string>('');
    errorMessage = signal<string>('');
    preventClearMessages = signal<boolean>(false); 
    loading = signal<boolean>(false); // Using signal for loading state

    setErrorMessage(message: string, preventClear = false) {
        this.errorMessage.set(message);
        this.preventClearMessages.set(preventClear); // Set flag
      }
    
      clearErrorMessage() {
        this.errorMessage.set('');
               this.preventClearMessages.set(false); // Reset flag
      }
  
    setSuccessMessage(message: string, preventClear = false) {
      this.successMessage.set(message);
      this.preventClearMessages.set(preventClear); // Store in BehaviorSubject
    }
  
    clearSuccessMessage() {
      this.successMessage.set('');
      this.preventClearMessages.set(false); // Reset properly
    }
  
    shouldClearMessages(): boolean {
      return !this.preventClearMessages(); // Retrieve value correctly
    }

    countries = ["Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Anguilla", "Antarctica", "Antigua and Barbuda", "Argentina", "Armenia", "Aruba", "Australia", "Austria", "Azerbaijan", "Bahamas (the)", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin", "Bermuda", "Bhutan", "Bolivia (Plurinational State of)", "Bonaire, Sint Eustatius and Saba", "Bosnia and Herzegovina", "Botswana", "Bouvet Island", "Brazil", "British Indian Ocean Territory (the)", "Brunei Darussalam", "Bulgaria", "Burkina Faso", "Burundi", "Cabo Verde", "Cambodia", "Cameroon", "Cayman Islands (the)", "Central African Republic (the)", "Chad", "Chile", "China", "Christmas Island", "Cocos (Keeling) Islands (the)", "Colombia", "Comoros (the)", "Congo (the Democratic Republic of the)", "Congo (the)", "Cook Islands (the)", "Costa Rica", "Croatia", "Cuba", "Curaçao", "Cyprus", "Czechia", "Côte d'Ivoire", "Denmark", "Djibouti", "Dominica", "Dominican Republic (the)", "Ecuador", "Egypt", "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia", "Eswatini", "Ethiopia", "Falkland Islands (the) [Malvinas]", "Faroe Islands (the)", "Fiji", "Finland", "France", "French Guiana", "French Polynesia", "French Southern Territories (the)", "Gabon", "Gambia (the)", "Georgia", "Germany", "Ghana", "Gibraltar", "Greece", "Greenland", "Grenada", "Guadeloupe", "Guam", "Guatemala", "Guernsey", "Guinea", "Guinea-Bissau", "Guyana", "Haiti", "Heard Island and McDonald Islands", "Holy See (the)", "Honduras", "Hong Kong", "Hungary", "Iceland", "India", "Indonesia", "Iran (Islamic Republic of)", "Iraq", "Ireland", "Isle of Man", "Italy", "Jamaica", "Japan", "Jersey", "Jordan", "Kazakhstan", "Kenya", "Kiribati", "Korea (the Democratic People's Republic of)", "Korea (the Republic of)", "Kuwait", "Kyrgyzstan", "Lao People's Democratic Republic (the)", "Latvia", "Lebanon", "Lesotho", "Liberia", "Libya", "Liechtenstein", "Lithuania", "Luxembourg", "Macao", "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali", "Malta", "Marshall Islands (the)", "Martinique", "Mauritania", "Mauritius", "Mayotte", "Mexico", "Micronesia (Federated States of)", "Moldova (the Republic of)", "Monaco", "Mongolia", "Montenegro", "Montserrat", "Morocco", "Mozambique", "Myanmar", "Namibia", "Nauru", "Nepal", "Netherlands (the)", "New Caledonia", "New Zealand", "Nicaragua", "Niger (the)", "Nigeria", "Niue", "Norfolk Island", "Northern Mariana Islands (the)", "Norway", "Oman", "Pakistan", "Palau", "Palestine, State of", "Panama", "Papua New Guinea", "Paraguay", "Peru", "Philippines (the)", "Pitcairn", "Poland", "Portugal", "Puerto Rico", "Qatar", "Republic of North Macedonia", "Romania", "Russian Federation (the)", "Rwanda", "Réunion", "Saint Barthélemy", "Saint Helena, Ascension and Tristan da Cunha", "Saint Kitts and Nevis", "Saint Lucia", "Saint Martin (French part)", "Saint Pierre and Miquelon", "Saint Vincent and the Grenadines", "Samoa", "San Marino", "Sao Tome and Principe", "Saudi Arabia", "Senegal", "Serbia", "Seychelles", "Sierra Leone", "Singapore", "Sint Maarten (Dutch part)", "Slovakia", "Slovenia", "Solomon Islands", "Somalia", "South Africa", "South Georgia and the South Sandwich Islands", "South Sudan", "Spain", "Sri Lanka", "Sudan (the)", "Suriname", "Svalbard and Jan Mayen", "Sweden", "Switzerland", "Syrian Arab Republic", "Taiwan", "Tajikistan", "Tanzania, United Republic of", "Thailand", "Timor-Leste", "Togo", "Tokelau", "Tonga", "Trinidad and Tobago", "Tunisia", "Turkey", "Turkmenistan", "Turks and Caicos Islands (the)", "Tuvalu", "Uganda", "Ukraine", "United Arab Emirates (the)", "United Kingdom of Great Britain and Northern Ireland (the)", "United States Minor Outlying Islands (the)", "Uruguay", "Uzbekistan", "Vanuatu", "Venezuela (Bolivarian Republic of)", "Viet Nam", "Virgin Islands (British)", "Virgin Islands (U.S.)", "Wallis and Futuna", "Western Sahara", "Yemen", "Zambia", "Zimbabwe", "Åland Islands"];
    davenfors: Davenfor[] = [];

    constructor(public httpService: HttpService) {}

    async populateCategories(): Promise<string[]> {
        if (this.categories.length > 0) {
            return Promise.resolve(this.categories);
        }

        return this.httpService.getCategories().toPromise()
            .then(data => {
                this.categories = data ?? [];
                return data ?? [];
            })
            .catch(error => {
                console.error('Error fetching categories:', error);
                return [];
            });
    }

    getDavenfors() {
        return this.davenfors;
    }

    clearMessages() {
        this.clearSuccessMessage();
        this.clearErrorMessage();
    }

    ngOnDestroy() {
        if (this.categoriesSub)
            this.categoriesSub.unsubscribe();
    }
}