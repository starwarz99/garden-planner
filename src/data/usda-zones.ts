import type { UsdaZone } from "@/types/garden";

export const usdaZones: UsdaZone[] = [
  { id: "1a", label: "Zone 1a", minTemp: -65, maxTemp: -60, firstFrost: "Jul 15", lastFrost: "Aug 15", description: "Extreme subarctic Alaska — Barrow, Prudhoe Bay" },
  { id: "1b", label: "Zone 1b", minTemp: -60, maxTemp: -55, firstFrost: "Aug 1", lastFrost: "Aug 1", description: "Interior Alaska — Fairbanks, Galena" },
  { id: "2a", label: "Zone 2a", minTemp: -50, maxTemp: -45, firstFrost: "Aug 15", lastFrost: "Jul 15", description: "Northern Alaska interior — Anchorage outskirts, Dawson City (Yukon)" },
  { id: "2b", label: "Zone 2b", minTemp: -45, maxTemp: -40, firstFrost: "Sep 1", lastFrost: "Jul 1", description: "Northern interior regions — Yellowknife (NWT), International Falls MN" },
  { id: "3a", label: "Zone 3a", minTemp: -40, maxTemp: -35, firstFrost: "Sep 15", lastFrost: "Jun 1", description: "Northern Great Plains, Minnesota — Duluth MN, Bismarck ND, Thunder Bay ON" },
  { id: "3b", label: "Zone 3b", minTemp: -35, maxTemp: -30, firstFrost: "Sep 15", lastFrost: "May 15", description: "Northern Minnesota, Montana — Fargo ND, Great Falls MT, Marquette MI" },
  { id: "4a", label: "Zone 4a", minTemp: -30, maxTemp: -25, firstFrost: "Oct 1", lastFrost: "May 15", description: "Northern New England, North Dakota — Burlington VT, Rapid City SD, Calgary AB" },
  { id: "4b", label: "Zone 4b", minTemp: -25, maxTemp: -20, firstFrost: "Oct 1", lastFrost: "May 1", description: "Upper Midwest, Wyoming — Minneapolis MN, Casper WY, Green Bay WI" },
  { id: "5a", label: "Zone 5a", minTemp: -20, maxTemp: -15, firstFrost: "Oct 15", lastFrost: "Apr 30", description: "Chicago, Denver, New England — Des Moines IA, Boston MA, Detroit MI" },
  { id: "5b", label: "Zone 5b", minTemp: -15, maxTemp: -10, firstFrost: "Oct 15", lastFrost: "Apr 15", description: "Mid-Atlantic upland, Great Lakes — Cleveland OH, Indianapolis IN, Providence RI" },
  { id: "6a", label: "Zone 6a", minTemp: -10, maxTemp: -5, firstFrost: "Oct 31", lastFrost: "Apr 15", description: "St. Louis, Kansas City, Virginia — Columbus OH, Louisville KY, Pittsburgh PA" },
  { id: "6b", label: "Zone 6b", minTemp: -5, maxTemp: 0, firstFrost: "Nov 1", lastFrost: "Apr 1", description: "Mid-Atlantic, Tennessee uplands — Baltimore MD, Raleigh NC, Knoxville TN" },
  { id: "7a", label: "Zone 7a", minTemp: 0, maxTemp: 5, firstFrost: "Nov 15", lastFrost: "Mar 15", description: "Washington DC, Oklahoma City, NM — Richmond VA, Albuquerque NM, Nashville TN" },
  { id: "7b", label: "Zone 7b", minTemp: 5, maxTemp: 10, firstFrost: "Nov 15", lastFrost: "Mar 1", description: "Virginia coast, Arkansas — Charlotte NC, Little Rock AR, Tulsa OK" },
  { id: "8a", label: "Zone 8a", minTemp: 10, maxTemp: 15, firstFrost: "Dec 1", lastFrost: "Feb 15", description: "Pacific Northwest, South Carolina — Dallas TX, Columbia SC, Roseburg OR" },
  { id: "8b", label: "Zone 8b", minTemp: 15, maxTemp: 20, firstFrost: "Dec 1", lastFrost: "Feb 15", description: "Seattle, Portland, Georgia coast — Savannah GA, Tacoma WA, Baton Rouge LA" },
  { id: "9a", label: "Zone 9a", minTemp: 20, maxTemp: 25, firstFrost: "Dec 15", lastFrost: "Jan 31", description: "Sacramento, Los Angeles inland — Austin TX, Fresno CA, Phoenix AZ" },
  { id: "9b", label: "Zone 9b", minTemp: 25, maxTemp: 30, firstFrost: "Jan 1", lastFrost: "Jan 31", description: "San Diego, Phoenix suburbs — Los Angeles CA, Houston TX, Riverside CA" },
  { id: "10a", label: "Zone 10a", minTemp: 30, maxTemp: 35, firstFrost: "Jan 31", lastFrost: "Jan 31", description: "Miami suburbs, southern Texas — Fort Lauderdale FL, Brownsville TX, Naples FL" },
  { id: "10b", label: "Zone 10b", minTemp: 35, maxTemp: 40, firstFrost: "Feb 28", lastFrost: "Jan 15", description: "Miami, Hawaii, coastal California — Key West FL, Honolulu HI, Santa Barbara CA" },
  { id: "11a", label: "Zone 11a", minTemp: 40, maxTemp: 45, firstFrost: "None", lastFrost: "None", description: "Hawaii, Puerto Rico — Hilo HI, San Juan PR" },
  { id: "11b", label: "Zone 11b", minTemp: 45, maxTemp: 50, firstFrost: "None", lastFrost: "None", description: "Tropical Hawaii, Caribbean — Kona HI, Mayagüez PR, US Virgin Islands" },
  { id: "12a", label: "Zone 12a", minTemp: 50, maxTemp: 55, firstFrost: "None", lastFrost: "None", description: "Tropical lowlands — Guam, lowland Puerto Rico" },
  { id: "12b", label: "Zone 12b", minTemp: 55, maxTemp: 60, firstFrost: "None", lastFrost: "None", description: "Hot tropical zones — American Samoa, Mariana Islands" },
  { id: "13a", label: "Zone 13a", minTemp: 60, maxTemp: 65, firstFrost: "None", lastFrost: "None", description: "Hottest tropical zones — Death Valley CA area, equatorial US territories" },
  { id: "13b", label: "Zone 13b", minTemp: 65, maxTemp: 70, firstFrost: "None", lastFrost: "None", description: "Extreme tropical — hottest lowland US territories" },
];

export function getZoneById(id: string): UsdaZone | undefined {
  return usdaZones.find((z) => z.id === id);
}

export function getZoneNumber(zoneId: string): number {
  return parseInt(zoneId.replace(/[ab]/, ""), 10);
}
