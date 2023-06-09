import {
	serializeTime,
	serializeTimeString,
	serializeDate,
	serializeDateTime,
	serializeDateTimeString,
	serializeUnixTimestamp,
	parseTime,
	parseDate,
	parseDateTime,
} from "../src/utils";
import { stringify } from "jest-matcher-utils";
import MockDate from "mockdate";

// Mock the new Date() call so it always returns 2017-01-01T00:00:00.000Z
MockDate.set(new Date(Date.UTC(2017, 0, 1)));

const mockDateString: Record<string, [Date, string][]> = {
	a: [
		[new Date(Date.UTC(2016, 1, 1)), "00:00:00.000Z"],
		[new Date(Date.UTC(2016, 1, 1, 2, 4, 10, 344)), "02:04:10.344Z"],
	],
	b: [
		[new Date(Date.UTC(2016, 1, 1)), "2016-02-01"],
		[new Date(Date.UTC(2016, 1, 1, 4, 5, 5)), "2016-02-01"],
		[new Date(Date.UTC(2016, 2, 3)), "2016-03-03"],
	],
	c: [
		[new Date(Date.UTC(2016, 1, 1)), "2016-02-01T00:00:00.000Z"],
		[new Date(Date.UTC(2016, 3, 5, 10, 1, 4, 555)), "2016-04-05T10:01:04.555Z"],
	],
	d: [
		[new Date(Date.UTC(2016, 1, 1)), "2016-02-01T00:00:00.000Z"],
		[new Date(Date.UTC(2016, 3, 5, 10, 1, 4, 555)), "2016-04-05T10:01:04.555Z"],
	],
};

const mockNumberString: Record<string, [number, string][]> = {
	a: [
		[854325678, "1997-01-27T00:41:18.000Z"],
		[876535, "1970-01-11T03:28:55.000Z"],
		[876535.8, "1970-01-11T03:28:55.800Z"],
		[876535.8321, "1970-01-11T03:28:55.832Z"],
		[-876535.8, "1969-12-21T20:31:04.200Z"],
		[0, "1970-01-01T00:00:00.000Z"],
		// The maximum representable unix timestamp
		[2147483647, "2038-01-19T03:14:07.000Z"],
		// The minimum representable unit timestamp
		[-2147483648, "1901-12-13T20:45:52.000Z"],
	],
};

const mockStringString: Record<string, [string, string][]> = {
	a: [
		["00:00:00.000Z", "00:00:00.000Z"],
		["12:23:44Z", "12:23:44Z"],
		["14:38:12+01:00", "13:38:12Z"],
		["00:00:00.4567+01:30", "22:30:00.4567Z"],
		["14:38:12.1+01:00", "13:38:12.1Z"],
	],
	b: [
		["2016-02-01T00:00:00Z", "2016-02-01T00:00:00Z"],
		["2016-02-01T12:23:44Z", "2016-02-01T12:23:44Z"],
		["2016-02-01T14:38:12-01:00", "2016-02-01T15:38:12Z"],
		["2016-02-02T00:00:00.4567+01:30", "2016-02-01T22:30:00.4567Z"],
		["2016-02-01T14:38:12.1+01:00", "2016-02-01T13:38:12.1Z"],
	],
};

const mockStringDate: Record<string, [string, Date][]> = {
	a: [
		["00:00:59Z", new Date(Date.UTC(2017, 0, 1, 0, 0, 59))],
		["00:00:00+01:30", new Date(Date.UTC(2016, 11, 31, 22, 30))],
		["00:00:00.1Z", new Date(Date.UTC(2017, 0, 1, 0, 0, 0, 100))],
		["00:00:00.12Z", new Date(Date.UTC(2017, 0, 1, 0, 0, 0, 120))],
		["00:00:00.000Z", new Date(Date.UTC(2017, 0, 1))],
		["00:00:00.993Z", new Date(Date.UTC(2017, 0, 1, 0, 0, 0, 993))],
		["00:00:00.123456Z", new Date(Date.UTC(2017, 0, 1, 0, 0, 0, 123))],
		// No rounding takes place!
		["00:00:00.12399Z", new Date(Date.UTC(2017, 0, 1, 0, 0, 0, 123))],
		["00:00:00.450+01:30", new Date(Date.UTC(2016, 11, 31, 22, 30, 0, 450))],
		["00:00:00.450-01:30", new Date(Date.UTC(2017, 0, 1, 1, 30, 0, 450))],
	],
	b: [
		["2016-12-17", new Date(Date.UTC(2016, 11, 17))],
		["2016-02-01", new Date(Date.UTC(2016, 1, 1))],
	],
	c: [
		// Datetime with hours, minutes and seconds
		["2016-02-01T00:00:00Z", new Date(Date.UTC(2016, 1, 1, 0, 0, 0))],
		["2016-02-01T00:00:15Z", new Date(Date.UTC(2016, 1, 1, 0, 0, 15))],
		["2016-02-01T00:00:59Z", new Date(Date.UTC(2016, 1, 1, 0, 0, 59))],
		["2016-02-01T00:00:00-11:00", new Date(Date.UTC(2016, 1, 1, 11))],
		["2017-01-07T11:25:00+01:00", new Date(Date.UTC(2017, 0, 7, 10, 25))],
		["2017-01-07T00:00:00+01:00", new Date(Date.UTC(2017, 0, 6, 23))],
		// Datetime with hours, minutes, seconds and fractional seconds.
		["2016-02-01T00:00:00.12Z", new Date(Date.UTC(2016, 1, 1, 0, 0, 0, 120))],
		["2016-02-01T00:00:00.123456Z", new Date(Date.UTC(2016, 1, 1, 0, 0, 0, 123))],
		["2016-02-01T00:00:00.12399Z", new Date(Date.UTC(2016, 1, 1, 0, 0, 0, 123))],
		["2016-02-01T00:00:00.000Z", new Date(Date.UTC(2016, 1, 1, 0, 0, 0, 0))],
		["2016-02-01T00:00:00.993Z", new Date(Date.UTC(2016, 1, 1, 0, 0, 0, 993))],
		["2017-01-07T11:25:00.450+01:00", new Date(Date.UTC(2017, 0, 7, 10, 25, 0, 450))],
	],
};

describe("formatting", () => {
	mockDateString.a.forEach(([date, time]) => {
		test(`serializes ${stringify(date)} into time-string ${time}`, () => {
			expect(serializeTime(date)).toEqual(time);
		});
	});

	mockStringString.a.forEach(([input, output]) => {
		test(`serializes time-string ${input} into UTC time-string ${output}`, () => {
			expect(serializeTimeString(input)).toEqual(output);
		});
	});

	mockDateString.b.forEach(([date, dateString]) => {
		test(`serializes ${stringify(date)} into date-string ${dateString}`, () => {
			expect(serializeDate(date)).toEqual(dateString);
		});
	});

	mockDateString.c.forEach(([date, dateTimeString]) => {
		test(`serializes ${stringify(date)} into date-time-string ${dateTimeString}`, () => {
			expect(serializeDateTime(date)).toEqual(dateTimeString);
		});
	});

	mockDateString.d.forEach(([date, dateTimeString]) => {
		test(`serializes ${stringify(date)} into date-time-string ${dateTimeString}`, () => {
			expect(serializeDateTime(date)).toEqual(dateTimeString);
		});
	});

	mockNumberString.a.forEach(([timestamp, dateTimeString]) => {
		test(`serializes Unix timestamp ${stringify(
			timestamp
		)} into date-time-string ${dateTimeString}`, () => {
			expect(serializeUnixTimestamp(timestamp)).toEqual(dateTimeString);
		});
	});

	mockStringDate.a.forEach(([time, date]) => {
		test(`parses time ${stringify(time)} into Date ${stringify(date)}`, () => {
			expect(parseTime(time)).toEqual(date);
		});
	});

	mockStringDate.b.forEach(([dateString, date]) => {
		test(`parses date ${stringify(dateString)} into Date ${stringify(date)}`, () => {
			expect(parseDate(dateString)).toEqual(date);
		});
	});

	mockStringDate.c.forEach(([dateTime, date]) => {
		test(`parses date-time ${stringify(dateTime)} into Date ${stringify(date)}`, () => {
			expect(parseDateTime(dateTime)).toEqual(date);
		});
	});

	mockStringString.b.forEach(([input, output]) => {
		test(`serializes date-time-string ${input} into UTC date-time-string ${output}`, () => {
			expect(serializeDateTimeString(input)).toEqual(output);
		});
	});
});
