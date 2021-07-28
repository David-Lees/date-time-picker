/**
 * luxon-date-time.module
 */

import { NgModule } from '@angular/core';
import {
    LuxonDateTimeAdapter,
    OWL_LUXON_DATE_TIME_ADAPTER_OPTIONS,
} from './luxon-date-time-adapter.class';
import { OWL_LUXON_DATE_TIME_FORMATS } from './luxon-date-time-format.class';
import {
    DateTimeAdapter,
    OWL_DATE_TIME_LOCALE,
} from '../date-time-adapter.class';
import { OWL_DATE_TIME_FORMATS } from '../date-time-format.class';

@NgModule({
    providers: [
        {
            provide: DateTimeAdapter,
            useClass: LuxonDateTimeAdapter,
            deps: [OWL_DATE_TIME_LOCALE, OWL_LUXON_DATE_TIME_ADAPTER_OPTIONS],
        },
    ],
})
export class LuxonDateTimeModule {}

@NgModule({
    imports: [LuxonDateTimeModule],
    providers: [
        {
            provide: OWL_DATE_TIME_FORMATS,
            useValue: OWL_LUXON_DATE_TIME_FORMATS,
        },
    ],
})
export class OwlLuxonDateTimeModule {}
