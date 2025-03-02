// src/components/DailyPlan/helpers.js
export const getBaseHue = (id) => {
    let hash = 0;
    const str = id?.toString() || '';
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return Math.abs(hash) % 360;
  };
  
  export const renderClientAddress = (client) => {
    if (!client) return "";
    return [client.street, client.haus_number, client.postal_code, client.city, client.country]
      .filter(Boolean)
      .join(", ");
  };