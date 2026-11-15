export const INITIAL_HUBS = [
  {
    id: "hub-1",
    name: "Phoenix Grand Mall Parking",
    city: "Mumbai",
    address: "Lower Parel, Senapati Bapat Marg",
    hourlyRate: 60,
    totalSlots: 12,
    slots: [
      { id: "P1-01", number: "P1-01", type: "CAR", status: "AVAILABLE", floor: "B1", rate: 60 },
      { id: "P1-02", number: "P1-02", type: "CAR", status: "OCCUPIED", floor: "B1", rate: 60 },
      { id: "P1-03", number: "P1-03", type: "EV", status: "AVAILABLE", floor: "B1", rate: 85 },
      { id: "P1-04", number: "P1-04", type: "BIKE", status: "AVAILABLE", floor: "B1", rate: 30 },
      { id: "P1-05", number: "P1-05", type: "CAR", status: "AVAILABLE", floor: "B1", rate: 60 },
      { id: "P1-06", number: "P1-06", type: "CAR", status: "OCCUPIED", floor: "B1", rate: 60 },
      { id: "P1-07", number: "P1-07", type: "BIKE", status: "AVAILABLE", floor: "B2", rate: 30 },
      { id: "P1-08", number: "P1-08", type: "EV", status: "AVAILABLE", floor: "B2", rate: 85 },
      { id: "P1-09", number: "P1-09", type: "CAR", status: "AVAILABLE", floor: "B2", rate: 60 },
      { id: "P1-10", number: "P1-10", type: "CAR", status: "AVAILABLE", floor: "B2", rate: 60 }
    ]
  },
  {
    id: "hub-2",
    name: "Whitefield Tech Park Bay",
    city: "Bengaluru",
    address: "ITPL Main Road, Brookefield",
    hourlyRate: 45,
    totalSlots: 8,
    slots: [
      { id: "W1-01", number: "W1-01", type: "CAR", status: "AVAILABLE", floor: "Ground", rate: 45 },
      { id: "W1-02", number: "W1-02", type: "EV", status: "AVAILABLE", floor: "Ground", rate: 70 },
      { id: "W1-03", number: "W1-03", type: "BIKE", status: "OCCUPIED", floor: "Ground", rate: 20 },
      { id: "W1-04", number: "W1-04", type: "CAR", status: "AVAILABLE", floor: "Ground", rate: 45 },
      { id: "W1-05", number: "W1-05", type: "CAR", status: "OCCUPIED", floor: "Level 1", rate: 45 },
      { id: "W1-06", number: "W1-06", type: "BIKE", status: "AVAILABLE", floor: "Level 1", rate: 20 }
    ]
  },
  {
    id: "hub-3",
    name: "Connaught Central Parking Hub",
    city: "Delhi",
    address: "Inner Circle, Rajiv Chowk",
    hourlyRate: 70,
    totalSlots: 10,
    slots: [
      { id: "C1-01", number: "C1-01", type: "CAR", status: "AVAILABLE", floor: "Basement", rate: 70 },
      { id: "C1-02", number: "C1-02", type: "EV", status: "OCCUPIED", floor: "Basement", rate: 95 },
      { id: "C1-03", number: "C1-03", type: "CAR", status: "AVAILABLE", floor: "Basement", rate: 70 },
      { id: "C1-04", number: "C1-04", type: "BIKE", status: "AVAILABLE", floor: "Basement", rate: 35 },
      { id: "C1-05", number: "C1-05", type: "CAR", status: "AVAILABLE", floor: "Basement", rate: 70 }
    ]
  }
];
