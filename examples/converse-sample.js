const { CXMLBuilder } = require('../');

// Create a hotel concierge AI voice agent
const hotelConciergeAgent = new CXMLBuilder()
  .createResponse()
  .addGather({
    input: "speech",
    speechEngine: "google",
    actionOnEmptyResult: true,
    speechTimeout: 1.5,
    speechDetection: "stt"
  }, gatherCxml => {
    gatherCxml.addConverse({
      voice: "Google:en-US-Neural2-F", 
      language: "en-US",
      model: "openai:gpt-4o-mini",
      sessionTools: "redirect dial hangup",
      temperature: 0.7
    }, converseCxml => {
      // Add a reservations tool for booking hotel rooms
      converseCxml.addTool("reservationSystem", "https://hotel.example.com/api/reservations")
        .addDescription("Access the hotel reservation system to check availability and make bookings")
        .addParameter("checkInDate", { 
          description: "Check-in date in YYYY-MM-DD format",
          type: "string", 
          required: true 
        })
        .addParameter("checkOutDate", { 
          description: "Check-out date in YYYY-MM-DD format",
          type: "string", 
          required: true 
        })
        .addParameter("roomType", { 
          description: "Type of room required",
          type: "enum", 
          values: "standard,deluxe,suite,penthouse" 
        })
        .addParameter("guests", { 
          description: "Number of guests",
          type: "integer" 
        })
        .done();
      
      // Add a second tool for local recommendations
      converseCxml.addTool("localRecommendations", "https://hotel.example.com/api/recommendations")
        .addDescription("Get recommendations for restaurants, attractions, and activities near the hotel")
        .addParameter("category", { 
          type: "enum", 
          values: "restaurant,attraction,shopping,nightlife" 
        })
        .addParameter("distance", { 
          description: "Maximum distance in miles",
          type: "number" 
        })
        .done();
      
      // System prompt to define the AI's behavior
      converseCxml.addSystem(`
        You are a helpful and professional hotel concierge at the Luxury Grand Hotel.
        
        When greeting guests:
        - Welcome them warmly and introduce yourself as the hotel's AI concierge
        - Offer assistance with room bookings, local recommendations, and hotel information
        - If guests inquire about room availability, use the reservationSystem tool
        - If guests ask about local attractions, use the localRecommendations tool
        
        Hotel information:
        - We have a pool open from 7am to 10pm
        - Restaurant hours are 6:30am-10:30am for breakfast, 12pm-2pm for lunch, and 6pm-10pm for dinner
        - Checkout time is 11am, but late checkout can be arranged until 2pm based on availability
        
        Keep your responses professional, concise, and helpful. 
        If you cannot help with a request, offer to connect the guest to a human concierge.
      `);
      
      // Speech input from the caller - must be last element
      converseCxml.addSpeech();
    });
  })
  .build();

console.log(hotelConciergeAgent);