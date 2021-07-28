/**
 * luxon-date-time-adapter.class
 */

import { Inject, Injectable, Optional, InjectionToken } from '@angular/core';
import { Info, DateTime } from 'luxon';
import {
    DateTimeAdapter,
    OWL_DATE_TIME_LOCALE,
} from '../date-time-adapter.class';

/** Configurable options for {@see LuxonDateAdapter}. */
export interface OwlLuxonDateTimeAdapterOptions {
    /**
     * Turns the use of utc dates on or off.
     * Changing this will change how the DateTimePicker output value.
     * {@default false}
     */
    useUtc: boolean;

    /**
     * Turns the use of strict string parsing in luxon.
     * Changing this will change how the DateTimePicker interprets input.
     * {@default false}
     */
    parseStrict: boolean;
}

/** InjectionToken for luxon date adapter to configure options. */
export const OWL_LUXON_DATE_TIME_ADAPTER_OPTIONS =
    new InjectionToken<OwlLuxonDateTimeAdapterOptions>(
        'OWL_LUXON_DATE_TIME_ADAPTER_OPTIONS',
        {
            providedIn: 'root',
            factory: OWL_LUXON_DATE_TIME_ADAPTER_OPTIONS_FACTORY,
        }
    );

/** @docs-private */
export function OWL_LUXON_DATE_TIME_ADAPTER_OPTIONS_FACTORY(): OwlLuxonDateTimeAdapterOptions {
    return {
        useUtc: false,
        parseStrict: false,
    };
}

/** Creates an array and fills it with values. */
function range<T>(length: number, valueFunction: (index: number) => T): T[] {
    const valuesArray = Array(length);
    for (let i = 0; i < length; i++) {
        valuesArray[i] = valueFunction(i);
    }
    return valuesArray;
}

@Injectable()
export class LuxonDateTimeAdapter extends DateTimeAdapter<DateTime> {
    getDate(date: DateTime): number {
        throw new Error('Method not implemented.');
    }
    getTime(date: DateTime): number {
        throw new Error('Method not implemented.');
    }
    clone(date: DateTime): DateTime {
        return date;
    }

    constructor(
        @Optional()
        @Inject(OWL_DATE_TIME_LOCALE)
        private owlDateTimeLocale: string,
        @Optional()
        @Inject(OWL_LUXON_DATE_TIME_ADAPTER_OPTIONS)
        private options?: OwlLuxonDateTimeAdapterOptions
    ) {
        super();
        this.setLocale(owlDateTimeLocale || DateTime.now().locale);
    }

    public setLocale(locale: string) {
        super.setLocale(locale);
    }

    public getYear(date: DateTime): number {
        return date.year;
    }

    public getMonth(date: DateTime): number {
        return date.month;
    }

    public getDay(date: DateTime): number {
        return date.day;
    }

    public getHours(date: DateTime): number {
        return date.hour;
    }

    public getMinutes(date: DateTime): number {
        return date.minute;
    }

    public getSeconds(date: DateTime): number {
        return date.second;
    }

    public getNumDaysInMonth(date: DateTime): number {
        return date.daysInMonth;
    }

    public differenceInCalendarDays(
        dateLeft: DateTime,
        dateRight: DateTime
    ): number {
        return dateLeft.diff(dateRight, 'days').days;
    }

    public getYearName(date: DateTime): string {
        return date.toFormat('YYYY');
    }

    public getMonthNames(style: 'long' | 'short' | 'narrow'): string[] {
        return style === 'long' ? Info.months('long') : Info.months('short');
    }

    public getDayOfWeekNames(style: 'long' | 'short' | 'narrow'): string[] {
        if (style === 'long') {
            return Info.weekdays('long');
        }
        return Info.weekdays('short');
    }

    public getDateNames(): string[] {
      return [];
    }

    public toIso8601(date: DateTime): string {
        return date.toISO();
    }

    public isEqual(dateLeft: DateTime, dateRight: DateTime): boolean {
        if (dateLeft && dateRight) {
            return dateLeft === dateRight;
        }
        return dateLeft === dateRight;
    }

    public isSameDay(dateLeft: DateTime, dateRight: DateTime): boolean {
        if (dateLeft && dateRight) {
            return dateLeft.hasSame(dateRight, 'day');
        }

        return dateLeft === dateRight;
    }

    public isValid(date: DateTime): boolean {
        return date.isValid;
    }

    public invalid(): DateTime {
        return DateTime.invalid('');
    }

    public isDateInstance(obj: any): boolean {
        return DateTime.isDateTime(obj);
    }

    public addCalendarYears(date: DateTime, amount: number): DateTime {
        return date.plus({ years: amount });
    }

    public addCalendarMonths(date: DateTime, amount: number): DateTime {
        return date.plus({ months: amount });
    }

    public addCalendarDays(date: DateTime, amount: number): DateTime {
        return date.plus({ days: amount });
    }

    public setHours(date: DateTime, amount: number): DateTime {
        return date.set({ hour: amount });
    }

    public setMinutes(date: DateTime, amount: number): DateTime {
        return date.set({ minute: amount });
    }

    public setSeconds(date: DateTime, amount: number): DateTime {
        return date.set({ second: amount });
    }

    public createDate(year: number, month: number, date: number): DateTime;
    public createDate(
        year: number,
        month: number,
        date: number,
        hours: number = 0,
        minutes: number = 0,
        seconds: number = 0
    ): DateTime {
        if (month < 1 || month > 12) {
            throw Error(
                `Invalid month index "${month}". Month index has to be between 1 and 12.`
            );
        }

        if (date < 1) {
            throw Error(
                `Invalid date "${date}". Date has to be greater than 0.`
            );
        }

        if (hours < 0 || hours > 23) {
            throw Error(
                `Invalid hours "${hours}". Hours has to be between 0 and 23.`
            );
        }

        if (minutes < 0 || minutes > 59) {
            throw Error(
                `Invalid minutes "${minutes}". Minutes has to between 0 and 59.`
            );
        }

        if (seconds < 0 || seconds > 59) {
            throw Error(
                `Invalid seconds "${seconds}". Seconds has to be between 0 and 59.`
            );
        }

        const result = this.createDateTime({
            year,
            month,
            date,
            hours,
            minutes,
            seconds,
        }).setLocale(this.getLocale());

        // If the result isn't valid, the date must have been out of bounds for this month.
        if (!result.isValid) {
            throw Error(
                `Invalid date "${date}" for month with index "${month}".`
            );
        }

        return result;
    }

    public now(): DateTime {
        return DateTime.now();
    }

    public format(date: DateTime, displayFormat: any): string {
        if (!this.isValid(date)) {
            throw Error('LuxonDateTimeAdapter: Cannot format invalid date.');
        }
        return date.toFormat(displayFormat);
    }

    public parse(value: any, parseFormat: any): DateTime | null {
        if (value && value instanceof Date) {
            return DateTime.fromJSDate(value);
        }
        if (value && typeof value === 'string') {
            return DateTime.fromFormat(value, parseFormat);
        }
        return value
            ? this.createDateTime(value).setLocale(this.getLocale())
            : null;
    }

    get parseStrict() {
        return this.options && this.options.parseStrict;
    }

    /**
     * Returns the given value if given a valid DateTime or null. Deserializes valid ISO 8601 strings
     * (https://www.ietf.org/rfc/rfc3339.txt) and valid Date objects into valid DateTimes and empty
     * string into null. Returns an invalid date for all other values.
     */
    deserialize(value: any): DateTime | null {
        let date: DateTime | null;
        if (value instanceof Date) {
            date = DateTime.fromJSDate(value);
        }
        if (typeof value === 'string') {
            if (!value) {
                return null;
            }
            date = DateTime.fromISO(value);
        }
        if (date && this.isValid(date)) {
            return date;
        }
        return super.deserialize(value);
    }

    /** Creates a DateTime instance while respecting the current UTC settings. */
    private createDateTime(...args: any[]): DateTime {
        return this.options && this.options.useUtc
            ? DateTime.utc(...args)
            : DateTime.local(...args);
    }
}
