export const DATA = {
  Asia: {
    India: {
      Rajasthan: {
        cities: {
          Jaipur: {
            id: 1,
            name: "Jaipur",
            image: "https://picsum.photos/300/200?1", // ✅ city-level image
            places: [
              { id: 101, name: "Hawa Mahal", image: "https://picsum.photos/300/200?10", sequence:1,
            activity: 'ACTIVITY 1', mode: 'Mode of Transport 1' },
              { id: 102, name: "Amber Fort", image: "https://picsum.photos/300/200?7", sequence:2,
            activity: 'ACTIVITY 2', mode: 'Mode of Transport 2' },
            ],
            
          },
          Jaisalmer: {
            id: 2,
            name: "Jaisalmer",
            image: "https://picsum.photos/300/200?2", // ✅ city-level image
            places: [
              { id: 201, name: "Jaisalmer Fort", image: "https://picsum.photos/300/200?9" },
              { id: 202, name: "Sam Sand Dunes", image: "https://picsum.photos/300/200?8" },
            ],
             sequence:2,
            activity: 'ACTIVITY 2'
          },
          Udaipur: {
            id: 3,
            name: "Udaipur",
            image: "https://picsum.photos/300/200?3", 
            places: [
              { id: 301, name: "Lake Pichola", image: "https://picsum.photos/300/200?4" },
              { id: 302, name: "City Palace", image: "https://picsum.photos/300/200?5" },
            ],
          },
        },
      },
    },
    UAE: {
      "Abu Dhabi": {
        cities: {
          "Abu Dhabi": {
            id: 1,
            name: "Abu Dhabi",
            image: "https://picsum.photos/300/200?1", // ✅ city-level image
            places: [
              { id: 101, name: "Burj Khalifa", image: "https://picsum.photos/300/200?10" },
              { id: 102, name: "Dubai Fountain", image: "https://picsum.photos/300/200?7" },
            ],
          }
         
        },
      },
    },
  },
};


