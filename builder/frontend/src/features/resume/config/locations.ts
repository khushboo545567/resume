/*
 * City suggestions for every "Location" field (Education, Internship).
 * Format follows the placeholders in the forms: "City, Country".
 */

import { searchOptions, type Option } from "./searchOptions";

const LOCATIONS: Option[] = [
  // ── India: most common first ──
  { name: "Bengaluru, India", aliases: ["bangalore", "blr"] },
  { name: "Hyderabad, India", aliases: ["telangana", "secunderabad"] },
  { name: "Pune, India", aliases: ["poona", "maharashtra"] },
  { name: "Mumbai, India", aliases: ["bombay", "maharashtra"] },
  { name: "Delhi, India", aliases: ["new delhi", "ncr"] },
  { name: "Remote", aliases: ["work from home", "wfh", "anywhere"] },
  { name: "Gurugram, India", aliases: ["gurgaon", "haryana", "ncr"] },
  { name: "Noida, India", aliases: ["uttar pradesh", "ncr"] },
  { name: "Chennai, India", aliases: ["madras", "tamil nadu"] },
  { name: "Kolkata, India", aliases: ["calcutta", "west bengal"] },
  { name: "Ahmedabad, India", aliases: ["gujarat"] },
  { name: "Indore, India", aliases: ["madhya pradesh"] },
  { name: "Bhopal, India", aliases: ["madhya pradesh"] },
  { name: "Jaipur, India", aliases: ["rajasthan"] },
  { name: "Chandigarh, India", aliases: ["punjab"] },
  { name: "Lucknow, India", aliases: ["uttar pradesh"] },
  { name: "Kochi, India", aliases: ["cochin", "kerala"] },
  { name: "Thiruvananthapuram, India", aliases: ["trivandrum", "kerala"] },
  { name: "Coimbatore, India", aliases: ["tamil nadu"] },
  { name: "Nagpur, India", aliases: ["maharashtra"] },
  { name: "Surat, India", aliases: ["gujarat"] },
  { name: "Vadodara, India", aliases: ["baroda", "gujarat"] },
  { name: "Visakhapatnam, India", aliases: ["vizag", "andhra pradesh"] },
  { name: "Bhubaneswar, India", aliases: ["odisha", "orissa"] },
  { name: "Patna, India", aliases: ["bihar"] },
  { name: "Ranchi, India", aliases: ["jharkhand"] },
  { name: "Raipur, India", aliases: ["chhattisgarh"] },
  { name: "Dehradun, India", aliases: ["uttarakhand"] },
  { name: "Guwahati, India", aliases: ["assam"] },
  { name: "Mysuru, India", aliases: ["mysore", "karnataka"] },
  { name: "Mangaluru, India", aliases: ["mangalore", "karnataka"] },
  { name: "Nashik, India", aliases: ["maharashtra"] },
  { name: "Gwalior, India", aliases: ["madhya pradesh"] },
  { name: "Jabalpur, India", aliases: ["madhya pradesh"] },
  { name: "Ujjain, India", aliases: ["madhya pradesh"] },
  { name: "Kanpur, India", aliases: ["uttar pradesh"] },
  { name: "Varanasi, India", aliases: ["banaras", "benares", "uttar pradesh"] },
  { name: "Vellore, India", aliases: ["tamil nadu"] },
  { name: "Mohali, India", aliases: ["punjab"] },
  { name: "Faridabad, India", aliases: ["haryana"] },
  { name: "Ghaziabad, India", aliases: ["uttar pradesh"] },

  // ── Outside India ──
  { name: "Dubai, UAE" },
  { name: "Singapore" },
  { name: "London, UK" },
  { name: "Berlin, Germany" },
  { name: "Amsterdam, Netherlands" },
  { name: "Dublin, Ireland" },
  { name: "Toronto, Canada" },
  { name: "San Francisco, USA", aliases: ["sf", "bay area", "california"] },
  { name: "New York, USA", aliases: ["nyc", "ny"] },
  { name: "Seattle, USA", aliases: ["washington"] },
  { name: "Austin, USA", aliases: ["texas"] },
  { name: "Sydney, Australia" },
];

// Match on the city only: typing "ind" should find Indore, not every
// "..., India" entry.
const CITY_LOCATIONS: Option[] = LOCATIONS.map((location) => ({
  ...location,
  matchOn: location.name.split(",")[0],
}));

export const searchLocations = (input: string, limit = 6) =>
  searchOptions(CITY_LOCATIONS, input, limit);
