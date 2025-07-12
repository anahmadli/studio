export const prayerMethodMap: { [key: string]: number } = {
  "Shia Ithna-Ansari": 0,
  "University of Islamic Sciences, Karachi": 1,
  "Islamic Society of North America (ISNA)": 2,
  "Muslim World League": 3,
  "Umm al-Qura University, Makkah": 4,
  "Egyptian General Authority of Survey": 5,
  "Institute of Geophysics, University of Tehran": 7,
  "Gulf Region": 8,
  "Kuwait": 9,
  "Qatar": 10,
  "Majlis Ugama Islam Singapura, Singapore": 11,
  "Union Organization islamic de France": 12,
  "Diyanet İşleri Başkanlığı, Turkey": 13,
  "Spiritual Administration of Muslims of Russia": 14,
  "Moonsighting Committee Worldwide": 15,
  "Dubai": 16,
};

// A function to find the closest matching key, as AI output can be slightly different
export function getPrayerMethodId(methodName: string): number | undefined {
  if (prayerMethodMap[methodName]) {
    return prayerMethodMap[methodName];
  }
  
  const lowerCaseMethodName = methodName.toLowerCase();
  for (const key in prayerMethodMap) {
    if (key.toLowerCase().includes(lowerCaseMethodName)) {
      return prayerMethodMap[key];
    }
  }
  
  // Default to ISNA if no match found
  return 2; 
}
