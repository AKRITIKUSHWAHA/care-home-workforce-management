const fs = require('fs');

const sections = [
  {
    section: "Bedrooms",
    questions: [
      "Are Bed, Mattress and Cover clean?",
      "Are Shelves, Ledges, and Windowsills clean?",
      "Is Furniture clean?",
      "Are Skirting Boards clean?",
      "Are Ceilings and Corners clean?",
      "Are Door Frames and Picture Frames clean?",
      "Are Light Fittings clean?",
      "Is Flooring clean?",
      "Is it clean Behind Furniture?",
      "Are Waste Bins clean?",
      "Are Curtains clean?",
      "Are Vanity Sinks and Commodes clean?",
      "Are Toilet, Sink and Surround clean?",
      "Are Soap Dishes clean?",
      "Are Medication cupboard Shelves, Ledges and Mirrors clean?",
      "Are Toilet Brushes and Dispensers clean?",
      "Is Flooring in en-suite clean?",
      "Are Ceilings & Corners in en-suite clean?",
      "Are Air Vents & Fans clean?",
      "Are Towels & Toiletries clean?",
      "Are Wall tiles clean?"
    ]
  },
  {
    section: "Communal Bathrooms & Toilets",
    questions: [
      "Are Toilet, Sink and Surround clean?",
      "Are Soap Dishes clean?",
      "Are Plugs clean?",
      "Are Shelves, Ledges and Mirrors clean?",
      "Are Toilet Brushes and Dispensers clean?",
      "Are Flooring and Walls (Tiles) clean?",
      "Are Ceilings & Corners clean?",
      "Are Air Vents & Fans clean?"
    ]
  },
  {
    section: "Lounges and Dining Areas",
    questions: [
      "Are Shelves, Ledges, Windowsills clean?",
      "Are Windows and Mirrors clean?",
      "Are Entertainment Systems clean?",
      "Are Picture Frames and Ornaments clean?",
      "Are Light Fittings and Door Frames clean?",
      "Are Bookcases and Display Units clean?",
      "Is Furniture clean?",
      "Are Skirting Boards clean?",
      "Is Flooring clean?",
      "Are Curtains and Blinds clean?",
      "Are Waste Bins clean?",
      "Are Fans, Air Vents, and AC Units clean?",
      "Are High Levels clean?",
      "Are Low Levels clean?"
    ]
  },
  {
    section: "Quiet Family Areas/Visitor Rooms",
    questions: [
      "Are Shelves, Ledges, Windowsills clean?",
      "Are Windows and Mirrors clean?",
      "Are Picture Frames and Ornaments clean?",
      "Are Light Fittings and Door Frames clean?",
      "Are Bookcases and Display Units clean?",
      "Is Furniture clean?",
      "Are Skirting Boards clean?",
      "Is Flooring clean?",
      "Are Curtains and Blinds clean?",
      "Are Waste Bins clean?",
      "Are High Levels clean?",
      "Are Low Levels clean?"
    ]
  },
  {
    section: "Corridors, Staircases & Landing Areas",
    questions: [
      "Are Ceilings clean?",
      "Are Walls clean?",
      "Are Picture Frames clean?",
      "Are Windows and Windowsills clean?",
      "Are Handrail and Banisters clean?",
      "Are Spindles clean?",
      "Is Flooring clean?",
      "Are Doorways clean?",
      "Are Under Stair Areas clean?",
      "Is Furniture clean?",
      "Are Skirting Boards clean?"
    ]
  },
  {
    section: "Entrance Area",
    questions: [
      "Are Ceilings clean?",
      "Are Walls clean?",
      "Are Picture Frames/Wall Hangings clean?",
      "Are Windows and Windowsills clean?",
      "Are Light Fittings and Door Frames clean?",
      "Are Bookcases and Display Units clean?",
      "Is Furniture clean?",
      "Are Skirting Boards clean?",
      "Is Flooring clean?",
      "Are Curtains and Blinds clean?",
      "Are Doorways clean?",
      "Are Under Stair Areas clean?",
      "Are High Levels clean?",
      "Are Low Levels clean?"
    ]
  },
  {
    section: "Offices",
    questions: [
      "Are Surface Areas clean?",
      "Are Walls clean?",
      "Are Picture Frames clean?",
      "Are Windows and Windowsills clean?",
      "Is Flooring clean?",
      "Are Waste Bins clean?",
      "Are Doorways clean?",
      "Is Equipment Dust Free?",
      "Is Furniture clean?",
      "Are Skirting Boards clean?"
    ]
  },
  {
    section: "Miscellaneous Rooms",
    questions: [
      "Are Surface Areas clean?",
      "Are Walls clean?",
      "Are Picture Frames clean?",
      "Are Windows and Windowsills clean?",
      "Is Flooring clean?",
      "Are Sinks clean?",
      "Are High and Low Levels clean?",
      "Is Equipment Dust Free?",
      "Is Furniture clean?",
      "Are Dispensers clean?"
    ]
  },
  {
    section: "Record Keeping",
    questions: [
      "Are cleaning problems identified and recorded?",
      "Are Random Room Checks being carried out daily and recorded?",
      "Are Cleaning Schedules completed and signed daily?",
      "Are extra records recorded in line with infection control procedures?"
    ]
  }
];

const hmQuestions = [];
let id = 1;
sections.forEach(sec => {
  sec.questions.forEach(q => {
    hmQuestions.push({
      id: id++,
      section: sec.section,
      question: q
    });
  });
});

const config = {
  title: "House Keeping Cleaning Standards Audit",
  category: "Operations",
  frequency: "Monthly",
  targetScore: 90,
  questions: hmQuestions
};

const fileContent = `export const houseKeepingConfig = ${JSON.stringify(config, null, 2)};\n`;
fs.writeFileSync('d:\\Kiaan Work\\rota\\src\\modules\\audits\\configs\\houseKeeping.config.js', fileContent, 'utf8');
console.log("Generated houseKeeping.config.js successfully!");
fs.unlinkSync('d:\\Kiaan Work\\rota\\extracted_House_Keeping.txt');
fs.unlinkSync('d:\\Kiaan Work\\rota\\audit-requirements\\House_keeping_cleaning_standards.zip');
fs.rmSync('d:\\Kiaan Work\\rota\\audit-requirements\\House_keeping_cleaning_standards_extracted', { recursive: true, force: true });
